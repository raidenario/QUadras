defmodule Quadras.Schemas.MatchPlayer do
  @moduledoc """
  Match player schema tracking which users participated in a match.
  Stores stats like goals, assists, and MVP votes.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @sides ~w(home away)

  schema "match_players" do
    field(:side, :string)
    field(:goals_scored, :integer, default: 0)
    field(:assists, :integer, default: 0)
    field(:received_mvp_votes, :integer, default: 0)

    belongs_to(:match, Quadras.Schemas.Match)
    belongs_to(:user, Quadras.Schemas.User)
    belongs_to(:team, Quadras.Schemas.Team)

    timestamps(type: :utc_datetime)
  end

  @doc """
  Changeset for adding a player to a match.
  """
  def changeset(match_player, attrs) do
    match_player
    |> cast(attrs, [
      :match_id,
      :user_id,
      :team_id,
      :side,
      :goals_scored,
      :assists,
      :received_mvp_votes
    ])
    |> validate_required([:match_id, :user_id, :team_id, :side])
    |> validate_inclusion(:side, @sides)
    |> unique_constraint([:match_id, :user_id])
    |> foreign_key_constraint(:match_id)
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:team_id)
  end
end
