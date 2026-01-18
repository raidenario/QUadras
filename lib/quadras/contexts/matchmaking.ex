defmodule Quadras.Contexts.Matchmaking do
  @moduledoc """
  The Matchmaking context.
  Handles lobbies, challenges, queues, and matches.
  """
  import Ecto.Query, warn: false
  alias Quadras.Repo
  alias Quadras.Schemas.{Lobby, QueueTicket, Challenge, Match, MatchPlayer, Team, Venue}

  # =============================================================================
  # Lobbies
  # =============================================================================

  @doc """
  Gets or creates a lobby for a venue on a given date.
  """
  def get_or_create_lobby(%Venue{} = venue, date \\ Date.utc_today()) do
    case Repo.get_by(Lobby, venue_id: venue.id, reference_date: date) do
      nil ->
        %Lobby{}
        |> Lobby.changeset(%{venue_id: venue.id, reference_date: date})
        |> Repo.insert()

      lobby ->
        {:ok, lobby}
    end
  end

  @doc """
  Gets a lobby with its queue tickets preloaded.
  """
  def get_lobby_with_queue(lobby_id) do
    Lobby
    |> Repo.get(lobby_id)
    |> Repo.preload(queue_tickets: [:team])
  end

  # =============================================================================
  # Queue Operations
  # =============================================================================

  @doc """
  Adds a team to the lobby queue.
  """
  def join_queue(%Lobby{} = lobby, %Team{} = team, opts \\ []) do
    attrs = %{
      lobby_id: lobby.id,
      team_id: team.id,
      mmr_snapshot: team.mmr,
      available_from: Keyword.get(opts, :available_from),
      available_until: Keyword.get(opts, :available_until)
    }

    %QueueTicket{}
    |> QueueTicket.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Removes a team from the lobby queue.
  """
  def leave_queue(%Lobby{} = lobby, %Team{} = team) do
    case get_queue_ticket(lobby, team) do
      nil ->
        {:error, :not_in_queue}

      ticket ->
        ticket
        |> Ecto.Changeset.change(status: "left")
        |> Repo.update()
    end
  end

  @doc """
  Gets a team's queue ticket in a lobby.
  """
  def get_queue_ticket(%Lobby{} = lobby, %Team{} = team) do
    Repo.get_by(QueueTicket, lobby_id: lobby.id, team_id: team.id)
  end

  @doc """
  Lists all active tickets in a lobby queue.
  """
  def list_queue_tickets(%Lobby{} = lobby) do
    from(qt in QueueTicket,
      where: qt.lobby_id == ^lobby.id and qt.status == "waiting",
      order_by: [asc: qt.entered_at],
      preload: [:team]
    )
    |> Repo.all()
  end

  # =============================================================================
  # Challenges
  # =============================================================================

  @doc """
  Creates a challenge from one team to another.
  """
  def create_challenge(%Team{} = challenger, %Team{} = challenged, %Venue{} = venue, attrs \\ %{}) do
    challenge_attrs =
      attrs
      |> Map.put(:challenger_team_id, challenger.id)
      |> Map.put(:challenged_team_id, challenged.id)
      |> Map.put(:venue_id, venue.id)

    %Challenge{}
    |> Challenge.create_changeset(challenge_attrs)
    |> Repo.insert()
  end

  @doc """
  Accepts a challenge, creating a match.
  """
  def accept_challenge(%Challenge{} = challenge) do
    Repo.transaction(fn ->
      # Update challenge status
      challenge
      |> Challenge.status_changeset("accepted")
      |> Repo.update!()

      # Create the match
      match_attrs = %{
        venue_id: challenge.venue_id,
        challenge_id: challenge.id,
        home_team_id: challenge.challenger_team_id,
        away_team_id: challenge.challenged_team_id,
        scheduled_at: challenge.proposed_datetime,
        is_ranked: challenge.is_ranked
      }

      case create_match(match_attrs) do
        {:ok, match} -> match
        {:error, changeset} -> Repo.rollback(changeset)
      end
    end)
  end

  @doc """
  Rejects a challenge.
  """
  def reject_challenge(%Challenge{} = challenge) do
    challenge
    |> Challenge.status_changeset("rejected")
    |> Repo.update()
  end

  @doc """
  Gets a challenge by ID.
  """
  def get_challenge(id), do: Repo.get(Challenge, id)

  @doc """
  Lists pending challenges for a team.
  """
  def list_pending_challenges(%Team{} = team) do
    from(c in Challenge,
      where: c.challenged_team_id == ^team.id and c.status == "pending",
      where: c.expires_at > ^DateTime.utc_now(),
      preload: [:challenger_team, :venue]
    )
    |> Repo.all()
  end

  # =============================================================================
  # Matches
  # =============================================================================

  @doc """
  Creates a new match.
  """
  def create_match(attrs) do
    %Match{}
    |> Match.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Gets a match by ID.
  """
  def get_match(id), do: Repo.get(Match, id)

  @doc """
  Gets a match with preloads.
  """
  def get_match!(id, preloads \\ []) do
    Match
    |> Repo.get!(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Starts a match.
  """
  def start_match(%Match{status: "scheduled"} = match) do
    match
    |> Match.start_changeset()
    |> Repo.update()
  end

  def start_match(_), do: {:error, :invalid_status}

  @doc """
  Reports a score for a match.
  `side` is :home or :away
  """
  def report_score(%Match{} = match, side, home_score, away_score)
      when side in [:home, :away] and is_integer(home_score) and is_integer(away_score) do
    match
    |> Match.report_score_changeset(side, home_score, away_score)
    |> Repo.update()
    |> maybe_process_result()
  end

  @doc """
  Confirms an already reported score.
  """
  def confirm_score(%Match{} = match, side) when side in [:home, :away] do
    match
    |> Match.confirm_score_changeset(side)
    |> Repo.update()
    |> maybe_process_result()
  end

  @doc """
  Disputes a score.
  """
  def dispute_score(%Match{} = match) do
    match
    |> Match.dispute_changeset()
    |> Repo.update()
  end

  @doc """
  Admin resolves a disputed match.
  """
  def admin_resolve(%Match{} = match, attrs) do
    match
    |> Match.admin_resolve_changeset(attrs)
    |> Repo.update()
    |> maybe_process_result()
  end

  @doc """
  Cancels a match.
  """
  def cancel_match(%Match{} = match) do
    match
    |> Match.cancel_changeset()
    |> Repo.update()
  end

  @doc """
  Lists matches for a team.
  """
  def list_team_matches(%Team{} = team, opts \\ []) do
    from(m in Match,
      where: m.home_team_id == ^team.id or m.away_team_id == ^team.id,
      order_by: [desc: m.scheduled_at]
    )
    |> apply_match_filters(opts)
    |> Repo.all()
    |> Repo.preload([:home_team, :away_team, :venue])
  end

  defp apply_match_filters(query, []), do: query

  defp apply_match_filters(query, [{:status, status} | rest]) do
    query
    |> where([m], m.status == ^status)
    |> apply_match_filters(rest)
  end

  defp apply_match_filters(query, [{:limit, limit} | rest]) when is_integer(limit) do
    query
    |> limit(^limit)
    |> apply_match_filters(rest)
  end

  defp apply_match_filters(query, [_ | rest]), do: apply_match_filters(query, rest)

  # =============================================================================
  # Match Players
  # =============================================================================

  @doc """
  Adds a player to a match.
  """
  def add_match_player(%Match{} = match, %{user_id: user_id, team_id: team_id, side: side}) do
    %MatchPlayer{}
    |> MatchPlayer.changeset(%{
      match_id: match.id,
      user_id: user_id,
      team_id: team_id,
      side: side
    })
    |> Repo.insert()
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp maybe_process_result({:ok, %Match{status: "finished"} = match}) do
    # Trigger MMR calculation in background (async)
    Task.start(fn -> process_match_result(match) end)
    {:ok, match}
  end

  defp maybe_process_result(result), do: result

  defp process_match_result(%Match{is_ranked: false}), do: :ok

  defp process_match_result(%Match{} = match) do
    # This will be implemented in the MMR module
    Quadras.Contexts.MMR.process_match(match)
  end
end
