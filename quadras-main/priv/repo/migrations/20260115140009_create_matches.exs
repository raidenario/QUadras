defmodule Quadras.Repo.Migrations.CreateMatches do
  use Ecto.Migration

  def change do
    create table(:matches, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      # Metadata
      add(:venue_id, references(:venues, type: :binary_id), null: false)
      add(:field_id, references(:fields, type: :binary_id))
      add(:challenge_id, references(:challenges, type: :binary_id))

      # scheduled, in_progress, finished, cancelled, disputed
      add(:status, :string, default: "scheduled")
      add(:scheduled_at, :utc_datetime)
      add(:started_at, :utc_datetime)
      add(:finished_at, :utc_datetime)

      # Teams
      add(:home_team_id, references(:teams, type: :binary_id), null: false)
      add(:away_team_id, references(:teams, type: :binary_id), null: false)
      add(:home_score, :integer)
      add(:away_score, :integer)

      # Result
      # null if draw
      add(:winner_id, :binary_id)
      # normal, walkover, forfeit
      add(:victory_type, :string)
      add(:mvp_id, references(:users, type: :binary_id))

      # Validation
      add(:home_confirmed, :boolean, default: false)
      add(:away_confirmed, :boolean, default: false)
      add(:admin_intervened, :boolean, default: false)
      add(:is_ranked, :boolean, default: true)

      timestamps(type: :utc_datetime)
    end

    create(index(:matches, [:venue_id]))
    create(index(:matches, [:field_id]))
    create(index(:matches, [:status]))
    create(index(:matches, [:home_team_id]))
    create(index(:matches, [:away_team_id]))
    create(index(:matches, [:scheduled_at]))
  end
end
