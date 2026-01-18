defmodule Quadras.Contexts.MMR do
  @moduledoc """
  MMR (Matchmaking Rating) calculation using ELO-based algorithm.
  Updates team and individual player rankings after matches.
  """
  alias Quadras.Repo
  alias Quadras.Contexts.Teams
  alias Quadras.Schemas.Match

  # Base K-factor (determines how much a single match affects rating)
  @k_factor 32

  @doc """
  Processes a finished match and updates MMR for both teams.
  """
  def process_match(%Match{status: "finished", is_ranked: true} = match) do
    match = Repo.preload(match, [:home_team, :away_team])

    home_team = match.home_team
    away_team = match.away_team

    # Determine match result
    result = determine_result(match)

    # Calculate MMR changes
    home_mmr = Decimal.to_float(home_team.mmr)
    away_mmr = Decimal.to_float(away_team.mmr)

    {home_delta, away_delta} = calculate_mmr_delta(home_mmr, away_mmr, result)

    # Update teams
    case result do
      :home_win ->
        Teams.update_stats(home_team, :win, Decimal.from_float(home_delta))
        Teams.update_stats(away_team, :loss, Decimal.from_float(away_delta))

      :away_win ->
        Teams.update_stats(home_team, :loss, Decimal.from_float(home_delta))
        Teams.update_stats(away_team, :win, Decimal.from_float(away_delta))

      :draw ->
        Teams.update_stats(home_team, :draw, Decimal.from_float(0))
        Teams.update_stats(away_team, :draw, Decimal.from_float(0))
    end

    :ok
  end

  def process_match(_), do: :ok

  @doc """
  Calculates the expected win probability for a team.
  """
  def expected_score(team_mmr, opponent_mmr) do
    1.0 / (1.0 + :math.pow(10, (opponent_mmr - team_mmr) / 400))
  end

  @doc """
  Calculates MMR delta based on actual vs expected result.
  Returns {home_delta, away_delta}
  """
  def calculate_mmr_delta(home_mmr, away_mmr, result) do
    home_expected = expected_score(home_mmr, away_mmr)
    away_expected = expected_score(away_mmr, home_mmr)

    {home_actual, away_actual} =
      case result do
        :home_win -> {1.0, 0.0}
        :away_win -> {0.0, 1.0}
        :draw -> {0.5, 0.5}
      end

    home_delta = @k_factor * (home_actual - home_expected)
    away_delta = @k_factor * (away_actual - away_expected)

    {abs(home_delta), abs(away_delta)}
  end

  defp determine_result(%Match{home_score: home, away_score: away}) do
    cond do
      home > away -> :home_win
      away > home -> :away_win
      true -> :draw
    end
  end

  @doc """
  Gets the rank tier name for an MMR value.
  """
  def rank_tier(mmr) when is_number(mmr) do
    cond do
      mmr < 800 -> "Bronze"
      mmr < 1000 -> "Prata"
      mmr < 1200 -> "Ouro"
      mmr < 1400 -> "Platina"
      mmr < 1600 -> "Diamante"
      mmr < 1800 -> "Mestre"
      true -> "Grão-Mestre"
    end
  end
end
