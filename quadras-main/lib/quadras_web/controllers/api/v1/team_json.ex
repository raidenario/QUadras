defmodule QuadrasWeb.API.V1.TeamJSON do
  @moduledoc """
  JSON rendering for team responses.
  """

  def index(%{teams: teams}) do
    %{data: for(team <- teams, do: team_data(team))}
  end

  def show(%{team: team}) do
    %{data: team_data(team)}
  end

  defp team_data(team) do
    %{
      id: team.id,
      name: team.name,
      tag: team.tag,
      logo_url: team.logo_url,
      description: team.description,
      founded_at: team.founded_at,
      team_type: team.team_type,
      mmr: team.mmr,
      rank_tier: team.rank_tier,
      wins: team.wins,
      losses: team.losses,
      draws: team.draws,
      captain_id: team.captain_id,
      captain: if(Ecto.assoc_loaded?(team.captain), do: user_data(team.captain), else: nil),
      members: if(Ecto.assoc_loaded?(team.members), do: members_data(team.members), else: nil),
      inserted_at: team.inserted_at
    }
  end

  defp user_data(nil), do: nil

  defp user_data(user) do
    %{
      id: user.id,
      name: user.name,
      photo_url: user.photo_url
    }
  end

  defp members_data(members) do
    Enum.map(members, fn member ->
      %{
        id: member.id,
        user_id: member.user_id,
        role: member.role,
        joined_at: member.joined_at,
        user: if(Ecto.assoc_loaded?(member.user), do: user_data(member.user), else: nil)
      }
    end)
  end
end
