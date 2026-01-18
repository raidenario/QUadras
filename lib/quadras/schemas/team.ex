defmodule Quadras.Schemas.Team do
  @moduledoc """
  Team schema representing a group of players that compete together.
  Has a captain who manages team operations and challenges.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @team_types ~w(primary secondary)
  @rank_tiers ~w(Bronze Prata Ouro Platina Diamante Mestre Grão-Mestre)

  schema "teams" do
    # Identity
    field(:name, :string)
    field(:tag, :string)
    field(:logo_url, :string)
    field(:description, :string)
    field(:founded_at, :date)

    # Competitive
    field(:team_type, :string, default: "primary")
    field(:mmr, :decimal, default: Decimal.new("1000"))
    field(:rank_tier, :string, default: "Bronze")
    field(:wins, :integer, default: 0)
    field(:losses, :integer, default: 0)
    field(:draws, :integer, default: 0)

    # Relationships
    belongs_to(:captain, Quadras.Schemas.User)
    has_many(:members, Quadras.Schemas.TeamMember)
    has_many(:users, through: [:members, :user])

    has_many(:home_matches, Quadras.Schemas.Match, foreign_key: :home_team_id)
    has_many(:away_matches, Quadras.Schemas.Match, foreign_key: :away_team_id)
    has_many(:challenges_sent, Quadras.Schemas.Challenge, foreign_key: :challenger_team_id)

    has_many(:challenges_received, Quadras.Schemas.Challenge,
      foreign_key: :challenged_team_id
    )

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(name captain_id)a
  @optional_fields ~w(tag logo_url description founded_at team_type)a

  @doc """
  Changeset for creating a new team.
  """
  def create_changeset(team, attrs) do
    team
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_tag()
    |> validate_inclusion(:team_type, @team_types)
    |> unique_constraint(:tag)
    |> foreign_key_constraint(:captain_id)
  end

  @doc """
  Changeset for updating team info.
  """
  def update_changeset(team, attrs) do
    team
    |> cast(attrs, [:name, :tag, :logo_url, :description])
    |> validate_tag()
    |> unique_constraint(:tag)
  end

  @doc """
  Changeset for updating competitive stats after a match.
  """
  def stats_changeset(team, attrs) do
    team
    |> cast(attrs, [:mmr, :rank_tier, :wins, :losses, :draws])
    |> validate_inclusion(:rank_tier, @rank_tiers)
  end

  defp validate_tag(changeset) do
    changeset
    |> validate_length(:tag, min: 2, max: 4)
    |> validate_format(:tag, ~r/^[A-Z0-9]+$/i, message: "must contain only letters and numbers")
    |> update_change(:tag, &String.upcase/1)
  end

  @doc """
  Calculates the rank tier based on MMR.
  """
  def rank_tier_for_mmr(mmr) when is_number(mmr) do
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

  def rank_tier_for_mmr(%Decimal{} = mmr) do
    rank_tier_for_mmr(Decimal.to_float(mmr))
  end
end
