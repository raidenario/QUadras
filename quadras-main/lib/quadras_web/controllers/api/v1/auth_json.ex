defmodule QuadrasWeb.API.V1.AuthJSON do
  @moduledoc """
  JSON rendering for authentication responses.
  """

  def auth(%{user: user, token: token}) do
    %{
      data: %{
        user: user_data(user),
        token: token
      }
    }
  end

  def user(%{user: user}) do
    %{data: user_data(user)}
  end

  defp user_data(user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo_url: user.photo_url,
      bio: user.bio,
      preferred_position: user.preferred_position,
      dominant_foot: user.dominant_foot,
      mmr_individual: user.mmr_individual,
      fair_play_score: user.fair_play_score,
      mvp_count: user.mvp_count,
      total_matches: user.total_matches,
      search_radius_km: user.search_radius_km,
      primary_team_id: user.primary_team_id,
      latitude: user.latitude,
      longitude: user.longitude,
      inserted_at: user.inserted_at
    }
  end
end
