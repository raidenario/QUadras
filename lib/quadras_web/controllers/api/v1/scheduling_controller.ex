defmodule QuadrasWeb.API.V1.SchedulingController do
  @moduledoc """
  Scheduling controller for slot-based booking.
  """
  use QuadrasWeb, :controller

  alias Quadras.{Scheduling, Venues, Teams}
  alias Quadras.Guardian

  action_fallback(QuadrasWeb.FallbackController)

  @doc """
  Lists all time slots for a field on a specific date.
  GET /api/v1/fields/:field_id/slots?date=YYYY-MM-DD
  """
  def list_slots(conn, %{"field_id" => field_id, "date" => date_str}) do
    with {:ok, date} <- Date.from_iso8601(date_str),
         field when not is_nil(field) <- Venues.get_field!(field_id) do
      slots = Scheduling.list_slots(field, date)

      conn
      |> put_status(:ok)
      |> json(%{
        data: %{
          field_id: field_id,
          date: date_str,
          slots: format_slots(slots)
        }
      })
    else
      {:error, :invalid_format} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: %{message: "Invalid date format. Use YYYY-MM-DD"}})

      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: %{message: "Field not found"}})
    end
  end

  def list_slots(conn, %{"field_id" => _field_id}) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: %{message: "date parameter is required (format: YYYY-MM-DD)"}})
  end

  @doc """
  Creates an open match for the current user's team.
  POST /api/v1/fields/:field_id/book
  Body: { "team_id": "uuid", "slot_start": "2026-01-20T18:00:00Z", "is_ranked": true }
  """
  def book_slot(conn, %{"field_id" => field_id} = params) do
    current_user = Guardian.Plug.current_resource(conn)

    with {:ok, slot_start} <- parse_datetime(params["slot_start"]),
         field when not is_nil(field) <- Venues.get_field!(field_id),
         team when not is_nil(team) <- Teams.get_team(params["team_id"]),
         true <- Teams.captain?(team, current_user) do
      is_ranked = Map.get(params, "is_ranked", true)

      case Scheduling.create_open_match(field, team, slot_start, is_ranked: is_ranked) do
        {:ok, match} ->
          conn
          |> put_status(:created)
          |> json(%{
            data: %{
              id: match.id,
              status: match.status,
              slot_start: match.slot_start,
              slot_end: match.slot_end,
              home_team_id: match.home_team_id,
              field_id: match.field_id,
              message: "Slot booked successfully. Waiting for opponent."
            }
          })

        {:error, :slot_already_booked} ->
          conn
          |> put_status(:conflict)
          |> json(%{error: %{message: "This slot is already booked"}})

        {:error, :slot_in_past} ->
          conn
          |> put_status(:bad_request)
          |> json(%{error: %{message: "Cannot book a slot in the past"}})

        {:error, changeset} ->
          {:error, changeset}
      end
    else
      {:error, :invalid_datetime} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: %{message: "Invalid slot_start format. Use ISO8601 (e.g., 2026-01-20T18:00:00Z)"}})

      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: %{message: "Field or team not found"}})

      false ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: %{message: "Only the team captain can book matches"}})
    end
  end

  @doc """
  Joins an open match as the away team.
  POST /api/v1/matches/:id/join
  Body: { "team_id": "uuid" }
  """
  def join_match(conn, %{"id" => match_id, "team_id" => team_id}) do
    current_user = Guardian.Plug.current_resource(conn)

    with match when not is_nil(match) <- Scheduling.get_match(match_id, [:home_team, :venue]),
         team when not is_nil(team) <- Teams.get_team(team_id),
         true <- Teams.captain?(team, current_user) do
      case Scheduling.join_open_match(match, team) do
        {:ok, match} ->
          match = Quadras.Repo.preload(match, [:home_team, :away_team, :field])

          conn
          |> put_status(:ok)
          |> json(%{
            data: %{
              id: match.id,
              status: match.status,
              slot_start: match.slot_start,
              slot_end: match.slot_end,
              home_team: format_team(match.home_team),
              away_team: format_team(match.away_team),
              message: "Successfully joined the match!"
            }
          })

        {:error, :match_not_open} ->
          conn
          |> put_status(:bad_request)
          |> json(%{error: %{message: "This match is not open for joining"}})

        {:error, :cannot_play_self} ->
          conn
          |> put_status(:bad_request)
          |> json(%{error: %{message: "Cannot play against your own team"}})

        {:error, changeset} ->
          {:error, changeset}
      end
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: %{message: "Match or team not found"}})

      false ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: %{message: "Only the team captain can join matches"}})
    end
  end

  @doc """
  Lists all open matches for a venue (matches waiting for opponents).
  GET /api/v1/venues/:venue_id/open-matches
  """
  def list_open_matches(conn, %{"venue_id" => venue_id}) do
    venue = Venues.get_venue!(venue_id)

    if venue do
      matches = Scheduling.list_open_matches_for_venue(venue)

      conn
      |> put_status(:ok)
      |> json(%{
        data: %{
          venue_id: venue_id,
          open_matches: Enum.map(matches, &format_open_match/1)
        }
      })
    else
      conn
      |> put_status(:not_found)
      |> json(%{error: %{message: "Venue not found"}})
    end
  end

  @doc """
  Cancels a booking (open or scheduled match).
  DELETE /api/v1/matches/:id/cancel
  """
  def cancel_booking(conn, %{"id" => match_id}) do
    current_user = Guardian.Plug.current_resource(conn)

    with match when not is_nil(match) <- Scheduling.get_match(match_id, [:home_team]),
         true <- Teams.captain?(match.home_team, current_user) do
      case Scheduling.cancel_booking(match) do
        {:ok, match} ->
          conn
          |> put_status(:ok)
          |> json(%{data: %{id: match.id, status: "cancelled", message: "Booking cancelled"}})

        {:error, :cannot_cancel} ->
          conn
          |> put_status(:bad_request)
          |> json(%{error: %{message: "Cannot cancel this match"}})
      end
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: %{message: "Match not found"}})

      false ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: %{message: "Only the home team captain can cancel"}})
    end
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp parse_datetime(nil), do: {:error, :invalid_datetime}

  defp parse_datetime(datetime_str) when is_binary(datetime_str) do
    case DateTime.from_iso8601(datetime_str) do
      {:ok, datetime, _offset} -> {:ok, DateTime.truncate(datetime, :second)}
      _ -> {:error, :invalid_datetime}
    end
  end

  defp format_slots(slots) do
    Enum.map(slots, fn slot ->
      base = %{
        start: Time.to_iso8601(slot.start),
        end: Time.to_iso8601(slot.end),
        status: Atom.to_string(slot.status)
      }

      case slot.status do
        :free ->
          base

        :open ->
          Map.merge(base, %{
            match_id: slot.match_id,
            home_team: format_team(slot.home_team)
          })

        :confirmed ->
          Map.merge(base, %{
            match_id: slot.match_id,
            home_team: format_team(slot.home_team),
            away_team: format_team(slot[:away_team])
          })
      end
    end)
  end

  defp format_team(nil), do: nil

  defp format_team(team) do
    %{
      id: team.id,
      name: team.name,
      tag: team.tag
    }
  end

  defp format_open_match(match) do
    %{
      id: match.id,
      slot_start: match.slot_start,
      slot_end: match.slot_end,
      field: %{id: match.field.id, name: match.field.name},
      home_team: format_team(match.home_team)
    }
  end
end
