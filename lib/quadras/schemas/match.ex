defmodule Quadras.Schemas.Match do
  @moduledoc """
  Match schema representing a competitive game between two teams.
  Includes score validation, dispute handling, and result confirmation.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @statuses ~w(open scheduled in_progress finished cancelled disputed)
  @victory_types ~w(normal walkover forfeit)

  schema "matches" do
    # Metadata
    field(:status, :string, default: "scheduled")
    field(:scheduled_at, :utc_datetime)
    field(:started_at, :utc_datetime)
    field(:finished_at, :utc_datetime)

    # Slot scheduling
    field(:slot_start, :utc_datetime)
    field(:slot_end, :utc_datetime)

    # Scores
    field(:home_score, :integer)
    field(:away_score, :integer)

    # Result
    field(:winner_id, :binary_id)
    field(:victory_type, :string)
    field(:is_ranked, :boolean, default: true)

    # Validation
    field(:home_confirmed, :boolean, default: false)
    field(:away_confirmed, :boolean, default: false)
    field(:admin_intervened, :boolean, default: false)

    # Relationships
    belongs_to(:venue, Quadras.Schemas.Venue)
    belongs_to(:field, Quadras.Schemas.Field)
    belongs_to(:challenge, Quadras.Schemas.Challenge)
    belongs_to(:home_team, Quadras.Schemas.Team)
    belongs_to(:away_team, Quadras.Schemas.Team)
    belongs_to(:mvp, Quadras.Schemas.User)

    has_many(:match_players, Quadras.Schemas.MatchPlayer)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(venue_id home_team_id)a
  @optional_fields ~w(field_id challenge_id status scheduled_at is_ranked away_team_id slot_start slot_end)a

  @doc """
  Changeset for creating a match from a challenge.
  """
  def create_changeset(match, attrs) do
    match
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_inclusion(:status, @statuses)
    |> validate_different_teams()
    |> foreign_key_constraint(:venue_id)
    |> foreign_key_constraint(:home_team_id)
    |> foreign_key_constraint(:away_team_id)
  end

  @doc """
  Changeset for creating an open match (waiting for opponent).
  Used when a team wants to "play at home" in a specific slot.
  """
  def create_open_changeset(match, attrs) do
    match
    |> cast(attrs, [:venue_id, :field_id, :home_team_id, :slot_start, :slot_end, :is_ranked])
    |> validate_required([:venue_id, :field_id, :home_team_id, :slot_start, :slot_end])
    |> put_change(:status, "open")
    |> validate_slot_not_in_past()
    |> foreign_key_constraint(:venue_id)
    |> foreign_key_constraint(:field_id)
    |> foreign_key_constraint(:home_team_id)
    |> unique_constraint([:field_id, :slot_start], name: :matches_field_slot_unique, message: "slot already booked")
  end

  @doc """
  Changeset for a team joining an open match as visitor.
  """
  def join_changeset(match, away_team_id) do
    match
    |> change(away_team_id: away_team_id, status: "scheduled")
    |> validate_different_teams()
    |> foreign_key_constraint(:away_team_id)
  end

  defp validate_slot_not_in_past(changeset) do
    slot_start = get_field(changeset, :slot_start)
    now = DateTime.utc_now() |> DateTime.truncate(:second)

    if slot_start && DateTime.compare(slot_start, now) == :lt do
      add_error(changeset, :slot_start, "cannot book a slot in the past")
    else
      changeset
    end
  end

  @doc """
  Changeset for starting a match.
  """
  def start_changeset(match) do
    match
    |> change(status: "in_progress", started_at: DateTime.utc_now() |> DateTime.truncate(:second))
  end

  @doc """
  Changeset for reporting score (from one team's perspective).
  """
  def report_score_changeset(match, :home, home_score, away_score) do
    match
    |> change(
      home_score: home_score,
      away_score: away_score,
      home_confirmed: true
    )
    |> maybe_finish_if_consensus()
  end

  def report_score_changeset(match, :away, home_score, away_score) do
    match
    |> change(
      home_score: home_score,
      away_score: away_score,
      away_confirmed: true
    )
    |> maybe_finish_if_consensus()
  end

  @doc """
  Changeset for confirming an already reported score.
  """
  def confirm_score_changeset(match, :home) do
    match
    |> change(home_confirmed: true)
    |> maybe_finish_if_consensus()
  end

  def confirm_score_changeset(match, :away) do
    match
    |> change(away_confirmed: true)
    |> maybe_finish_if_consensus()
  end

  @doc """
  Changeset for disputing a score.
  """
  def dispute_changeset(match) do
    match
    |> change(status: "disputed")
  end

  @doc """
  Changeset for admin resolution.
  """
  def admin_resolve_changeset(match, attrs) do
    match
    |> cast(attrs, [:home_score, :away_score, :winner_id, :victory_type])
    |> validate_inclusion(:victory_type, @victory_types)
    |> change(
      status: "finished",
      admin_intervened: true,
      home_confirmed: true,
      away_confirmed: true,
      finished_at: DateTime.utc_now() |> DateTime.truncate(:second)
    )
    |> determine_winner()
  end

  @doc """
  Changeset for cancelling a match.
  """
  def cancel_changeset(match) do
    match
    |> change(status: "cancelled")
  end

  defp validate_different_teams(changeset) do
    home_id = get_field(changeset, :home_team_id)
    away_id = get_field(changeset, :away_team_id)

    if home_id && away_id && home_id == away_id do
      add_error(changeset, :away_team_id, "cannot play against the same team")
    else
      changeset
    end
  end

  defp maybe_finish_if_consensus(changeset) do
    home_confirmed = get_field(changeset, :home_confirmed)
    away_confirmed = get_field(changeset, :away_confirmed)

    if home_confirmed && away_confirmed do
      changeset
      |> change(status: "finished", finished_at: DateTime.utc_now() |> DateTime.truncate(:second))
      |> determine_winner()
    else
      changeset
    end
  end

  defp determine_winner(changeset) do
    home_score = get_field(changeset, :home_score)
    away_score = get_field(changeset, :away_score)
    home_team_id = get_field(changeset, :home_team_id)
    away_team_id = get_field(changeset, :away_team_id)

    cond do
      is_nil(home_score) or is_nil(away_score) ->
        changeset

      home_score > away_score ->
        put_change(changeset, :winner_id, home_team_id)
        |> put_change(:victory_type, "normal")

      away_score > home_score ->
        put_change(changeset, :winner_id, away_team_id)
        |> put_change(:victory_type, "normal")

      true ->
        # Draw
        put_change(changeset, :winner_id, nil)
        |> put_change(:victory_type, "normal")
    end
  end
end
