defmodule Quadras.Repo.Migrations.CreateMatchPlayers do
  use Ecto.Migration

  @doc """
  Track which players actually played in each match.
  This may differ from the team roster (substitutes, guests, etc.)
  """
  def change do
    create table(:match_players, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:match_id, references(:matches, type: :binary_id, on_delete: :delete_all), null: false)
      add(:user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false)
      add(:team_id, references(:teams, type: :binary_id, on_delete: :delete_all), null: false)

      # home, away
      add(:side, :string, null: false)
      add(:goals_scored, :integer, default: 0)
      add(:assists, :integer, default: 0)
      add(:received_mvp_votes, :integer, default: 0)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:match_players, [:match_id, :user_id]))
    create(index(:match_players, [:user_id]))
    create(index(:match_players, [:team_id]))
  end
end
