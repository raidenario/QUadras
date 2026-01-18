defmodule QuadrasWeb.API.V1.MatchController do
  @moduledoc """
  Match and matchmaking controller.
  """
  use QuadrasWeb, :controller

  alias Quadras.{Matchmaking, Teams, Venues}
  alias Quadras.Guardian

  action_fallback(QuadrasWeb.FallbackController)

  # =============================================================================
  # Lobby Operations
  # =============================================================================

  @doc """
  Gets the current lobby for a venue.
  GET /api/v1/venues/:venue_id/lobby
  """
  def show_lobby(conn, %{"venue_id" => venue_id}) do
    venue = Venues.get_venue!(venue_id)
    {:ok, lobby} = Matchmaking.get_or_create_lobby(venue)
    tickets = Matchmaking.list_queue_tickets(lobby)

    render(conn, :lobby, lobby: lobby, tickets: tickets)
  end

  @doc """
  Joins the queue for a venue.
  POST /api/v1/venues/:venue_id/lobby/join
  """
  def join_queue(conn, %{"venue_id" => venue_id, "team_id" => team_id} = params) do
    current_user = Guardian.Plug.current_resource(conn)
    venue = Venues.get_venue!(venue_id)
    team = Teams.get_team!(team_id)

    # Check if user is captain
    unless Teams.captain?(team, current_user) do
      conn
      |> put_status(:forbidden)
      |> put_view(json: QuadrasWeb.ErrorJSON)
      |> render(:"403")
    else
      {:ok, lobby} = Matchmaking.get_or_create_lobby(venue)

      opts = [
        available_from: params["available_from"],
        available_until: params["available_until"]
      ]

      case Matchmaking.join_queue(lobby, team, opts) do
        {:ok, ticket} ->
          conn
          |> put_status(:created)
          |> render(:ticket, ticket: ticket)

        {:error, changeset} ->
          {:error, changeset}
      end
    end
  end

  @doc """
  Leaves the queue for a venue.
  DELETE /api/v1/venues/:venue_id/lobby/leave
  """
  def leave_queue(conn, %{"venue_id" => venue_id, "team_id" => team_id}) do
    venue = Venues.get_venue!(venue_id)
    team = Teams.get_team!(team_id)
    {:ok, lobby} = Matchmaking.get_or_create_lobby(venue)

    case Matchmaking.leave_queue(lobby, team) do
      {:ok, _} ->
        send_resp(conn, :no_content, "")

      {:error, :not_in_queue} ->
        conn
        |> put_status(:not_found)
        |> put_view(json: QuadrasWeb.ErrorJSON)
        |> render(:"404")
    end
  end

  # =============================================================================
  # Challenge Operations
  # =============================================================================

  @doc """
  Creates a challenge.
  POST /api/v1/challenges
  """
  def create_challenge(conn, %{"challenge" => params}) do
    current_user = Guardian.Plug.current_resource(conn)
    challenger = Teams.get_team!(params["challenger_team_id"])
    challenged = Teams.get_team!(params["challenged_team_id"])
    venue = Venues.get_venue!(params["venue_id"])

    unless Teams.captain?(challenger, current_user) do
      conn
      |> put_status(:forbidden)
      |> put_view(json: QuadrasWeb.ErrorJSON)
      |> render(:"403")
    else
      case Matchmaking.create_challenge(challenger, challenged, venue, params) do
        {:ok, challenge} ->
          conn
          |> put_status(:created)
          |> render(:challenge, challenge: challenge)

        {:error, changeset} ->
          {:error, changeset}
      end
    end
  end

  @doc """
  Accepts a challenge.
  POST /api/v1/challenges/:id/accept
  """
  def accept_challenge(conn, %{"id" => id}) do
    challenge = Matchmaking.get_challenge(id)

    case Matchmaking.accept_challenge(challenge) do
      {:ok, match} ->
        render(conn, :match, match: match)

      {:error, _} = error ->
        error
    end
  end

  @doc """
  Rejects a challenge.
  POST /api/v1/challenges/:id/reject
  """
  def reject_challenge(conn, %{"id" => id}) do
    challenge = Matchmaking.get_challenge(id)

    case Matchmaking.reject_challenge(challenge) do
      {:ok, _} -> send_resp(conn, :no_content, "")
      {:error, _} = error -> error
    end
  end

  @doc """
  Lists pending challenges for the current user's teams.
  GET /api/v1/challenges
  """
  def list_challenges(conn, %{"team_id" => team_id}) do
    team = Teams.get_team!(team_id)
    challenges = Matchmaking.list_pending_challenges(team)
    render(conn, :challenges, challenges: challenges)
  end

  # =============================================================================
  # Match Operations
  # =============================================================================

  @doc """
  Shows a match.
  GET /api/v1/matches/:id
  """
  def show_match(conn, %{"id" => id}) do
    match = Matchmaking.get_match!(id, [:home_team, :away_team, :venue, :field])
    render(conn, :match, match: match)
  end

  @doc """
  Lists matches for a team.
  GET /api/v1/teams/:team_id/matches
  """
  def list_matches(conn, %{"team_id" => team_id} = params) do
    team = Teams.get_team!(team_id)

    opts = [
      status: params["status"],
      limit: params["limit"] && String.to_integer(params["limit"])
    ]

    matches = Matchmaking.list_team_matches(team, opts)
    render(conn, :matches, matches: matches)
  end

  @doc """
  Reports the score for a match.
  POST /api/v1/matches/:id/score
  """
  def report_score(conn, %{"id" => id, "home_score" => home, "away_score" => away, "side" => side}) do
    match = Matchmaking.get_match!(id)
    side_atom = String.to_existing_atom(side)

    case Matchmaking.report_score(match, side_atom, home, away) do
      {:ok, match} -> render(conn, :match, match: match)
      {:error, _} = error -> error
    end
  end

  @doc """
  Confirms score for a match.
  POST /api/v1/matches/:id/confirm
  """
  def confirm_score(conn, %{"id" => id, "side" => side}) do
    match = Matchmaking.get_match!(id)
    side_atom = String.to_existing_atom(side)

    case Matchmaking.confirm_score(match, side_atom) do
      {:ok, match} -> render(conn, :match, match: match)
      {:error, _} = error -> error
    end
  end

  @doc """
  Disputes a match score.
  POST /api/v1/matches/:id/dispute
  """
  def dispute_score(conn, %{"id" => id}) do
    match = Matchmaking.get_match!(id)

    case Matchmaking.dispute_score(match) do
      {:ok, match} -> render(conn, :match, match: match)
      {:error, _} = error -> error
    end
  end
end
