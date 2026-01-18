defmodule Quadras.Contexts.Teams do
  @moduledoc """
  The Teams context.
  Handles team creation, member management, and captain operations.
  """
  import Ecto.Query, warn: false
  alias Quadras.Repo
  alias Quadras.Schemas.{Team, TeamMember, User}

  # =============================================================================
  # Team CRUD
  # =============================================================================

  @doc """
  Gets a team by ID.
  """
  def get_team(id), do: Repo.get(Team, id)

  @doc """
  Gets a team by ID with preloaded associations.
  """
  def get_team!(id, preloads \\ []) do
    Team
    |> Repo.get!(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Gets a team by tag.
  """
  def get_team_by_tag(tag) when is_binary(tag) do
    Repo.get_by(Team, tag: String.upcase(tag))
  end

  @doc """
  Creates a new team with the given user as captain.
  Also adds the captain as a team member.
  """
  def create_team(%User{} = captain, attrs) do
    Repo.transaction(fn ->
      # Normalize all keys to strings to avoid mixed keys error
      string_attrs = attrs
        |> Enum.map(fn {k, v} -> {to_string(k), v} end)
        |> Map.new()
        |> Map.put("captain_id", captain.id)

      with {:ok, team} <- %Team{} |> Team.create_changeset(string_attrs) |> Repo.insert(),
           {:ok, _member} <- add_member(team, captain, "captain") do
        team
      else
        {:error, changeset} -> Repo.rollback(changeset)
      end
    end)
  end

  @doc """
  Updates a team's information.
  Only the captain can update the team.
  """
  def update_team(%Team{} = team, %User{id: user_id}, attrs) do
    if team.captain_id == user_id do
      team
      |> Team.update_changeset(attrs)
      |> Repo.update()
    else
      {:error, :not_captain}
    end
  end

  @doc """
  Lists all teams with optional filters.
  """
  def list_teams(opts \\ []) do
    Team
    |> apply_filters(opts)
    |> Repo.all()
  end

  defp apply_filters(query, []), do: query

  defp apply_filters(query, [{:rank_tier, tier} | rest]) do
    query
    |> where([t], t.rank_tier == ^tier)
    |> apply_filters(rest)
  end

  defp apply_filters(query, [{:search, term} | rest]) when is_binary(term) do
    pattern = "%#{term}%"

    query
    |> where([t], ilike(t.name, ^pattern) or ilike(t.tag, ^pattern))
    |> apply_filters(rest)
  end

  defp apply_filters(query, [_ | rest]), do: apply_filters(query, rest)

  # =============================================================================
  # Team Members
  # =============================================================================

  @doc """
  Adds a user to a team.
  """
  def add_member(%Team{} = team, %User{} = user, role \\ "member") do
    %TeamMember{}
    |> TeamMember.changeset(%{team_id: team.id, user_id: user.id, role: role})
    |> Repo.insert()
  end

  @doc """
  Removes a user from a team.
  Captain cannot be removed (must transfer first).
  """
  def remove_member(%Team{} = team, %User{} = user) do
    if team.captain_id == user.id do
      {:error, :cannot_remove_captain}
    else
      from(tm in TeamMember, where: tm.team_id == ^team.id and tm.user_id == ^user.id)
      |> Repo.delete_all()

      :ok
    end
  end

  @doc """
  Gets all members of a team.
  """
  def list_team_members(%Team{} = team) do
    from(tm in TeamMember,
      where: tm.team_id == ^team.id,
      preload: [:user]
    )
    |> Repo.all()
  end

  @doc """
  Transfers captain role to another team member.
  """
  def transfer_captain(%Team{} = team, %User{id: current_captain_id}, %User{} = new_captain) do
    if team.captain_id != current_captain_id do
      {:error, :not_captain}
    else
      Repo.transaction(fn ->
        # Check if new captain is a member
        case get_team_member(team, new_captain) do
          nil ->
            Repo.rollback(:not_a_member)

          old_member ->
            # Update team captain
            team
            |> Ecto.Changeset.change(captain_id: new_captain.id)
            |> Repo.update!()

            # Update roles
            old_member |> Ecto.Changeset.change(role: "captain") |> Repo.update!()

            from(tm in TeamMember,
              where: tm.team_id == ^team.id and tm.user_id == ^current_captain_id
            )
            |> Repo.update_all(set: [role: "member"])

            :ok
        end
      end)
    end
  end

  defp get_team_member(%Team{} = team, %User{} = user) do
    Repo.get_by(TeamMember, team_id: team.id, user_id: user.id)
  end

  # =============================================================================
  # Captain Checks
  # =============================================================================

  @doc """
  Checks if a user is the captain of a team.
  """
  def captain?(%Team{captain_id: captain_id}, %User{id: user_id}) do
    captain_id == user_id
  end

  @doc """
  Checks if a user is a member of a team.
  """
  def member?(%Team{} = team, %User{} = user) do
    get_team_member(team, user) != nil
  end

  # =============================================================================
  # Stats Updates
  # =============================================================================

  @doc """
  Updates team stats after a match result.
  """
  def update_stats(%Team{} = team, :win, mmr_delta) do
    new_mmr = Decimal.add(team.mmr, mmr_delta)

    team
    |> Team.stats_changeset(%{
      wins: team.wins + 1,
      mmr: new_mmr,
      rank_tier: Team.rank_tier_for_mmr(new_mmr)
    })
    |> Repo.update()
  end

  def update_stats(%Team{} = team, :loss, mmr_delta) do
    new_mmr = Decimal.sub(team.mmr, mmr_delta)

    team
    |> Team.stats_changeset(%{
      losses: team.losses + 1,
      mmr: new_mmr,
      rank_tier: Team.rank_tier_for_mmr(new_mmr)
    })
    |> Repo.update()
  end

  def update_stats(%Team{} = team, :draw, _mmr_delta) do
    team
    |> Team.stats_changeset(%{draws: team.draws + 1})
    |> Repo.update()
  end
end
