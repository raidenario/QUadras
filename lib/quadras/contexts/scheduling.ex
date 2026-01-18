defmodule Quadras.Contexts.Scheduling do
  @moduledoc """
  The Scheduling context.
  Handles slot generation, match booking, and slot availability.

  This context provides:
  - Dynamic slot generation based on field configuration
  - Open match creation (home team waiting for opponent)
  - Match joining (away team accepts open match)
  - Race condition protection via database constraints
  """
  import Ecto.Query, warn: false
  alias Quadras.Repo
  alias Quadras.Schemas.{Venue, Field, Match, Team}

  # =============================================================================
  # Slot Generation
  # =============================================================================

  @doc """
  Lists all time slots for a field on a specific date.
  Returns a list of slots with their status: :free, :open, or :confirmed

  ## Examples

      iex> list_slots(field, ~D[2026-01-20])
      [
        %{start: ~T[08:00:00], end: ~T[09:00:00], status: :free, match: nil},
        %{start: ~T[09:00:00], end: ~T[10:00:00], status: :open, match: %Match{}},
        %{start: ~T[10:00:00], end: ~T[11:00:00], status: :confirmed, match: %Match{}}
      ]
  """
  def list_slots(%Field{} = field, %Date{} = date) do
    field = Repo.preload(field, :venue)

    # Get effective opening/closing times
    opening = Field.effective_opening_time(field) || ~T[08:00:00]
    closing = Field.effective_closing_time(field) || ~T[22:00:00]
    duration = field.slot_duration_minutes || 60

    # Generate all possible slots
    slots = generate_time_slots(opening, closing, duration)

    # Fetch existing matches for this field on this date
    matches = get_matches_for_field_date(field.id, date)

    # Cross-reference slots with matches
    Enum.map(slots, fn {slot_start, slot_end} ->
      slot_datetime = time_to_datetime(date, slot_start)

      case find_match_at_slot(matches, slot_datetime) do
        nil ->
          %{
            start: slot_start,
            end: slot_end,
            status: :free,
            match_id: nil,
            home_team: nil
          }

        %Match{status: "open"} = match ->
          match = Repo.preload(match, :home_team)
          %{
            start: slot_start,
            end: slot_end,
            status: :open,
            match_id: match.id,
            home_team: match.home_team
          }

        %Match{} = match ->
          match = Repo.preload(match, [:home_team, :away_team])
          %{
            start: slot_start,
            end: slot_end,
            status: :confirmed,
            match_id: match.id,
            home_team: match.home_team,
            away_team: match.away_team
          }
      end
    end)
  end

  defp generate_time_slots(opening, closing, duration_minutes) do
    generate_time_slots(opening, closing, duration_minutes, [])
  end

  defp generate_time_slots(current, closing, duration_minutes, acc) do
    slot_end = Time.add(current, duration_minutes * 60, :second)

    if Time.compare(slot_end, closing) == :gt do
      Enum.reverse(acc)
    else
      generate_time_slots(slot_end, closing, duration_minutes, [{current, slot_end} | acc])
    end
  end

  defp get_matches_for_field_date(field_id, date) do
    start_of_day = DateTime.new!(date, ~T[00:00:00], "Etc/UTC")
    end_of_day = DateTime.new!(date, ~T[23:59:59], "Etc/UTC")

    from(m in Match,
      where: m.field_id == ^field_id,
      where: m.slot_start >= ^start_of_day and m.slot_start <= ^end_of_day,
      where: m.status != "cancelled"
    )
    |> Repo.all()
  end

  defp find_match_at_slot(matches, slot_datetime) do
    Enum.find(matches, fn match ->
      DateTime.compare(match.slot_start, slot_datetime) == :eq
    end)
  end

  defp time_to_datetime(date, time) do
    DateTime.new!(date, time, "Etc/UTC")
  end

  # =============================================================================
  # Open Match Creation (Play "at home")
  # =============================================================================

  @doc """
  Creates an open match for a team (playing as home team).
  The match will be in "open" status, waiting for an opposing team.

  This function is protected against race conditions by a unique constraint
  on (field_id, slot_start) in the database.

  ## Parameters
  - field: The field to book
  - home_team: The team creating the match (will be home team)
  - slot_start: The DateTime when the slot starts
  - opts: Optional parameters (is_ranked, etc.)

  ## Returns
  - {:ok, match} on success
  - {:error, :slot_already_booked} if another team booked first
  - {:error, :slot_in_past} if trying to book a past slot
  - {:error, changeset} on validation errors
  """
  def create_open_match(%Field{} = field, %Team{} = home_team, %DateTime{} = slot_start, opts \\ []) do
    field = Repo.preload(field, :venue)
    duration = field.slot_duration_minutes || 60
    slot_end = DateTime.add(slot_start, duration * 60, :second)

    attrs = %{
      venue_id: field.venue_id,
      field_id: field.id,
      home_team_id: home_team.id,
      slot_start: slot_start,
      slot_end: slot_end,
      is_ranked: Keyword.get(opts, :is_ranked, true)
    }

    %Match{}
    |> Match.create_open_changeset(attrs)
    |> Repo.insert()
    |> handle_insert_result()
  end

  defp handle_insert_result({:ok, match}), do: {:ok, match}

  defp handle_insert_result({:error, %Ecto.Changeset{errors: errors} = changeset}) do
    slot_error = Keyword.get(errors, :slot_start)

    cond do
      is_tuple(slot_error) and elem(slot_error, 1)[:constraint] == :unique ->
        {:error, :slot_already_booked}

      slot_error != nil ->
        case slot_error do
          {"slot already booked", _} -> {:error, :slot_already_booked}
          {"cannot book a slot in the past", _} -> {:error, :slot_in_past}
          _ -> {:error, changeset}
        end

      true ->
        {:error, changeset}
    end
  end

  # =============================================================================
  # Join Open Match (Play as visitor)
  # =============================================================================

  @doc """
  Allows a team to join an open match as the away team.
  Changes the match status from "open" to "scheduled".

  ## Parameters
  - match: The open match to join (must have status "open")
  - away_team: The team joining as visitor

  ## Returns
  - {:ok, match} on success
  - {:error, :match_not_open} if match is not in open status
  - {:error, :cannot_play_self} if trying to play against own team
  """
  def join_open_match(%Match{status: "open"} = match, %Team{} = away_team) do
    if match.home_team_id == away_team.id do
      {:error, :cannot_play_self}
    else
      match
      |> Match.join_changeset(away_team.id)
      |> Repo.update()
    end
  end

  def join_open_match(%Match{}, _), do: {:error, :match_not_open}

  # =============================================================================
  # Cancellation
  # =============================================================================

  @doc """
  Cancels an open or scheduled match.
  Only the home team captain should be able to cancel.
  """
  def cancel_booking(%Match{status: status} = match)
      when status in ["open", "scheduled"] do
    match
    |> Match.cancel_changeset()
    |> Repo.update()
  end

  def cancel_booking(_), do: {:error, :cannot_cancel}

  # =============================================================================
  # Queries
  # =============================================================================

  @doc """
  Gets a match by ID with optional preloads.
  """
  def get_match(id, preloads \\ []) do
    Match
    |> Repo.get(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Gets a match by ID, raises if not found.
  """
  def get_match!(id, preloads \\ []) do
    Match
    |> Repo.get!(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Gets all open matches for a specific field.
  """
  def list_open_matches(%Field{} = field) do
    from(m in Match,
      where: m.field_id == ^field.id and m.status == "open",
      where: m.slot_start > ^DateTime.utc_now(),
      order_by: [asc: m.slot_start],
      preload: [:home_team, :venue]
    )
    |> Repo.all()
  end

  @doc """
  Gets all open matches across all fields of a venue.
  """
  def list_open_matches_for_venue(%Venue{} = venue) do
    from(m in Match,
      where: m.venue_id == ^venue.id and m.status == "open",
      where: m.slot_start > ^DateTime.utc_now(),
      order_by: [asc: m.slot_start],
      preload: [:home_team, :field]
    )
    |> Repo.all()
  end
end
