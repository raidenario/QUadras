defmodule Quadras.Repo.Migrations.CreateTeams do
  use Ecto.Migration

  def change do
    create table(:teams, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      # Identity
      add(:name, :string, null: false)
      # LOUD, FNX (3-4 letter abbreviation)
      add(:tag, :string, size: 4)
      add(:logo_url, :string)
      add(:description, :text)
      add(:founded_at, :date)

      # Management
      add(:captain_id, references(:users, type: :binary_id, on_delete: :nilify_all), null: false)

      # Competitive
      # primary, secondary
      add(:team_type, :string, default: "primary")
      add(:mmr, :decimal, default: 1000)
      add(:rank_tier, :string, default: "Bronze")
      add(:wins, :integer, default: 0)
      add(:losses, :integer, default: 0)
      add(:draws, :integer, default: 0)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:teams, [:tag]))
    create(index(:teams, [:captain_id]))
    create(index(:teams, [:rank_tier]))

    # Add primary_team_id to users after teams table exists
    alter table(:users) do
      add(:primary_team_id, references(:teams, type: :binary_id, on_delete: :nilify_all))
    end
  end
end
