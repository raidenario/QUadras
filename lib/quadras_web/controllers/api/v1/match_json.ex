defmodule QuadrasWeb.API.V1.MatchJSON do
  @moduledoc """
  JSON rendering for match, lobby, and challenge responses.
  """

  # =============================================================================
  # Lobby
  # =============================================================================

  def lobby(%{lobby: lobby, tickets: tickets}) do
    %{
      data: %{
        id: lobby.id,
        venue_id: lobby.venue_id,
        reference_date: lobby.reference_date,
        is_active: lobby.is_active,
        queue: Enum.map(tickets, &ticket_data/1)
      }
    }
  end

  def ticket(%{ticket: ticket}) do
    %{data: ticket_data(ticket)}
  end

  defp ticket_data(ticket) do
    %{
      id: ticket.id,
      team_id: ticket.team_id,
      mmr_snapshot: ticket.mmr_snapshot,
      entered_at: ticket.entered_at,
      available_from: ticket.available_from,
      available_until: ticket.available_until,
      status: ticket.status,
      team: if(Ecto.assoc_loaded?(ticket.team), do: team_brief(ticket.team), else: nil)
    }
  end

  # =============================================================================
  # Challenges
  # =============================================================================

  def challenges(%{challenges: challenges}) do
    %{data: Enum.map(challenges, &challenge_data/1)}
  end

  def challenge(%{challenge: challenge}) do
    %{data: challenge_data(challenge)}
  end

  defp challenge_data(challenge) do
    %{
      id: challenge.id,
      status: challenge.status,
      proposed_datetime: challenge.proposed_datetime,
      is_ranked: challenge.is_ranked,
      message: challenge.message,
      expires_at: challenge.expires_at,
      challenger_team_id: challenge.challenger_team_id,
      challenged_team_id: challenge.challenged_team_id,
      venue_id: challenge.venue_id,
      challenger_team:
        if(Ecto.assoc_loaded?(challenge.challenger_team),
          do: team_brief(challenge.challenger_team),
          else: nil
        ),
      venue: if(Ecto.assoc_loaded?(challenge.venue), do: venue_brief(challenge.venue), else: nil),
      inserted_at: challenge.inserted_at
    }
  end

  # =============================================================================
  # Matches
  # =============================================================================

  def matches(%{matches: matches}) do
    %{data: Enum.map(matches, &match_data/1)}
  end

  def match(%{match: match}) do
    %{data: match_data(match)}
  end

  defp match_data(match) do
    %{
      id: match.id,
      status: match.status,
      scheduled_at: match.scheduled_at,
      started_at: match.started_at,
      finished_at: match.finished_at,
      home_score: match.home_score,
      away_score: match.away_score,
      winner_id: match.winner_id,
      victory_type: match.victory_type,
      is_ranked: match.is_ranked,
      home_confirmed: match.home_confirmed,
      away_confirmed: match.away_confirmed,
      admin_intervened: match.admin_intervened,
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      venue_id: match.venue_id,
      field_id: match.field_id,
      mvp_id: match.mvp_id,
      home_team:
        if(Ecto.assoc_loaded?(match.home_team), do: team_brief(match.home_team), else: nil),
      away_team:
        if(Ecto.assoc_loaded?(match.away_team), do: team_brief(match.away_team), else: nil),
      venue: if(Ecto.assoc_loaded?(match.venue), do: venue_brief(match.venue), else: nil),
      inserted_at: match.inserted_at
    }
  end

  # =============================================================================
  # Helpers
  # =============================================================================

  defp team_brief(team) do
    %{
      id: team.id,
      name: team.name,
      tag: team.tag,
      logo_url: team.logo_url,
      mmr: team.mmr,
      rank_tier: team.rank_tier
    }
  end

  defp venue_brief(venue) do
    %{
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      city: venue.city
    }
  end
end
