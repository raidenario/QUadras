# =============================================================================
# BACKWARD COMPATIBILITY ALIASES
# =============================================================================
# These modules re-export the new module structure for backward compatibility.
# The codebase can gradually migrate to use the new Quadras.Schemas.* and
# Quadras.Contexts.* module names.
# =============================================================================

# -----------------------------------------------------------------------------
# Schema Aliases (for code that imports Quadras.Accounts.User, etc.)
# -----------------------------------------------------------------------------

defmodule Quadras.Accounts.User do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.User
  defdelegate __struct__(kv), to: Quadras.Schemas.User
  defdelegate registration_changeset(user, attrs), to: Quadras.Schemas.User
  defdelegate profile_changeset(user, attrs), to: Quadras.Schemas.User
  defdelegate password_changeset(user, attrs), to: Quadras.Schemas.User
  defdelegate valid_password?(user, password), to: Quadras.Schemas.User
end

defmodule Quadras.Teams.Team do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Team
  defdelegate __struct__(kv), to: Quadras.Schemas.Team
  defdelegate create_changeset(team, attrs), to: Quadras.Schemas.Team
  defdelegate update_changeset(team, attrs), to: Quadras.Schemas.Team
  defdelegate stats_changeset(team, attrs), to: Quadras.Schemas.Team
  defdelegate rank_tier_for_mmr(mmr), to: Quadras.Schemas.Team
end

defmodule Quadras.Teams.TeamMember do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.TeamMember
  defdelegate __struct__(kv), to: Quadras.Schemas.TeamMember
  defdelegate changeset(member, attrs), to: Quadras.Schemas.TeamMember
end

defmodule Quadras.Venues.Venue do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Venue
  defdelegate __struct__(kv), to: Quadras.Schemas.Venue
  defdelegate create_changeset(venue, attrs), to: Quadras.Schemas.Venue
  defdelegate update_changeset(venue, attrs), to: Quadras.Schemas.Venue
  defdelegate get_coordinates(venue), to: Quadras.Schemas.Venue
end

defmodule Quadras.Venues.Field do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Field
  defdelegate __struct__(kv), to: Quadras.Schemas.Field
  defdelegate changeset(field, attrs), to: Quadras.Schemas.Field
  defdelegate effective_opening_time(field), to: Quadras.Schemas.Field
  defdelegate effective_closing_time(field), to: Quadras.Schemas.Field
end

defmodule Quadras.Matchmaking.Lobby do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Lobby
  defdelegate __struct__(kv), to: Quadras.Schemas.Lobby
  defdelegate changeset(lobby, attrs), to: Quadras.Schemas.Lobby
end

defmodule Quadras.Matchmaking.QueueTicket do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.QueueTicket
  defdelegate __struct__(kv), to: Quadras.Schemas.QueueTicket
  defdelegate changeset(ticket, attrs), to: Quadras.Schemas.QueueTicket
end

defmodule Quadras.Matchmaking.Challenge do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Challenge
  defdelegate __struct__(kv), to: Quadras.Schemas.Challenge
  defdelegate create_changeset(challenge, attrs), to: Quadras.Schemas.Challenge
  defdelegate status_changeset(challenge, status), to: Quadras.Schemas.Challenge
end

defmodule Quadras.Matchmaking.Match do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.Match
  defdelegate __struct__(kv), to: Quadras.Schemas.Match
  defdelegate create_changeset(match, attrs), to: Quadras.Schemas.Match
  defdelegate create_open_changeset(match, attrs), to: Quadras.Schemas.Match
  defdelegate join_changeset(match, away_team_id), to: Quadras.Schemas.Match
  defdelegate start_changeset(match), to: Quadras.Schemas.Match
  defdelegate report_score_changeset(match, side, home, away), to: Quadras.Schemas.Match
  defdelegate confirm_score_changeset(match, side), to: Quadras.Schemas.Match
  defdelegate dispute_changeset(match), to: Quadras.Schemas.Match
  defdelegate admin_resolve_changeset(match, attrs), to: Quadras.Schemas.Match
  defdelegate cancel_changeset(match), to: Quadras.Schemas.Match
end

defmodule Quadras.Matchmaking.MatchPlayer do
  @moduledoc false
  defdelegate __struct__(), to: Quadras.Schemas.MatchPlayer
  defdelegate __struct__(kv), to: Quadras.Schemas.MatchPlayer
  defdelegate changeset(player, attrs), to: Quadras.Schemas.MatchPlayer
end

# -----------------------------------------------------------------------------
# Context Aliases (for code that calls Quadras.Accounts.get_user/1, etc.)
# -----------------------------------------------------------------------------

defmodule Quadras.Accounts do
  @moduledoc false
  defdelegate get_user(id), to: Quadras.Contexts.Accounts
  defdelegate get_user!(id), to: Quadras.Contexts.Accounts
  defdelegate get_user_by_email(email), to: Quadras.Contexts.Accounts
  defdelegate authenticate_user(email, password), to: Quadras.Contexts.Accounts
  defdelegate register_user(attrs \\ %{}), to: Quadras.Contexts.Accounts
  defdelegate update_user_profile(user, attrs), to: Quadras.Contexts.Accounts
  defdelegate change_user_password(user, attrs), to: Quadras.Contexts.Accounts
  defdelegate change_user_registration(user, attrs \\ %{}), to: Quadras.Contexts.Accounts
  defdelegate list_users(opts \\ []), to: Quadras.Contexts.Accounts
  defdelegate update_reputation(user, attrs), to: Quadras.Contexts.Accounts
  defdelegate get_user_teams(user), to: Quadras.Contexts.Accounts
  defdelegate get_user_primary_team(user), to: Quadras.Contexts.Accounts
  defdelegate update_user_location(user, lat, lng), to: Quadras.Contexts.Accounts
end

defmodule Quadras.Teams do
  @moduledoc false
  defdelegate get_team(id), to: Quadras.Contexts.Teams
  defdelegate get_team!(id, preloads \\ []), to: Quadras.Contexts.Teams
  defdelegate get_team_by_tag(tag), to: Quadras.Contexts.Teams
  defdelegate create_team(captain, attrs), to: Quadras.Contexts.Teams
  defdelegate update_team(team, user, attrs), to: Quadras.Contexts.Teams
  defdelegate list_teams(opts \\ []), to: Quadras.Contexts.Teams
  defdelegate add_member(team, user, role \\ "member"), to: Quadras.Contexts.Teams
  defdelegate remove_member(team, user), to: Quadras.Contexts.Teams
  defdelegate list_team_members(team), to: Quadras.Contexts.Teams
  defdelegate transfer_captain(team, current, new), to: Quadras.Contexts.Teams
  defdelegate captain?(team, user), to: Quadras.Contexts.Teams
  defdelegate member?(team, user), to: Quadras.Contexts.Teams
  defdelegate update_stats(team, result, delta), to: Quadras.Contexts.Teams
end

defmodule Quadras.Venues do
  @moduledoc false
  defdelegate get_venue(id), to: Quadras.Contexts.Venues
  defdelegate get_venue!(id, preloads \\ []), to: Quadras.Contexts.Venues
  defdelegate get_venue_by_slug(slug), to: Quadras.Contexts.Venues
  defdelegate create_venue(attrs \\ %{}), to: Quadras.Contexts.Venues
  defdelegate update_venue(venue, attrs), to: Quadras.Contexts.Venues
  defdelegate list_venues(opts \\ []), to: Quadras.Contexts.Venues
  defdelegate find_nearby(lat, lng, radius, opts \\ []), to: Quadras.Contexts.Venues
  defdelegate get_field(id), to: Quadras.Contexts.Venues
  defdelegate get_field!(id, preloads \\ []), to: Quadras.Contexts.Venues
  defdelegate create_field(venue, attrs), to: Quadras.Contexts.Venues
  defdelegate update_field(field, attrs), to: Quadras.Contexts.Venues
  defdelegate list_fields(venue), to: Quadras.Contexts.Venues
end

defmodule Quadras.Matchmaking do
  @moduledoc false
  defdelegate get_or_create_lobby(venue, date \\ Date.utc_today()), to: Quadras.Contexts.Matchmaking
  defdelegate get_lobby_with_queue(lobby_id), to: Quadras.Contexts.Matchmaking
  defdelegate join_queue(lobby, team, opts \\ []), to: Quadras.Contexts.Matchmaking
  defdelegate leave_queue(lobby, team), to: Quadras.Contexts.Matchmaking
  defdelegate get_queue_ticket(lobby, team), to: Quadras.Contexts.Matchmaking
  defdelegate list_queue_tickets(lobby), to: Quadras.Contexts.Matchmaking
  defdelegate create_challenge(challenger, challenged, venue, attrs \\ %{}), to: Quadras.Contexts.Matchmaking
  defdelegate accept_challenge(challenge), to: Quadras.Contexts.Matchmaking
  defdelegate reject_challenge(challenge), to: Quadras.Contexts.Matchmaking
  defdelegate get_challenge(id), to: Quadras.Contexts.Matchmaking
  defdelegate list_pending_challenges(team), to: Quadras.Contexts.Matchmaking
  defdelegate create_match(attrs), to: Quadras.Contexts.Matchmaking
  defdelegate get_match(id), to: Quadras.Contexts.Matchmaking
  defdelegate get_match!(id, preloads \\ []), to: Quadras.Contexts.Matchmaking
  defdelegate start_match(match), to: Quadras.Contexts.Matchmaking
  defdelegate report_score(match, side, home, away), to: Quadras.Contexts.Matchmaking
  defdelegate confirm_score(match, side), to: Quadras.Contexts.Matchmaking
  defdelegate dispute_score(match), to: Quadras.Contexts.Matchmaking
  defdelegate admin_resolve(match, attrs), to: Quadras.Contexts.Matchmaking
  defdelegate cancel_match(match), to: Quadras.Contexts.Matchmaking
  defdelegate list_team_matches(team, opts \\ []), to: Quadras.Contexts.Matchmaking
  defdelegate add_match_player(match, attrs), to: Quadras.Contexts.Matchmaking
end

defmodule Quadras.Scheduling do
  @moduledoc false
  defdelegate list_slots(field, date), to: Quadras.Contexts.Scheduling
  defdelegate create_open_match(field, team, slot_start, opts \\ []), to: Quadras.Contexts.Scheduling
  defdelegate join_open_match(match, team), to: Quadras.Contexts.Scheduling
  defdelegate cancel_booking(match), to: Quadras.Contexts.Scheduling
  defdelegate get_match(id, preloads \\ []), to: Quadras.Contexts.Scheduling
  defdelegate get_match!(id, preloads \\ []), to: Quadras.Contexts.Scheduling
  defdelegate list_open_matches(field), to: Quadras.Contexts.Scheduling
  defdelegate list_open_matches_for_venue(venue), to: Quadras.Contexts.Scheduling
end

defmodule Quadras.MMR do
  @moduledoc false
  defdelegate process_match(match), to: Quadras.Contexts.MMR
  defdelegate expected_score(team_mmr, opponent_mmr), to: Quadras.Contexts.MMR
  defdelegate calculate_mmr_delta(home_mmr, away_mmr, result), to: Quadras.Contexts.MMR
  defdelegate rank_tier(mmr), to: Quadras.Contexts.MMR
end
