defmodule Quadras.Repo.Migrations.CreateChallenges do
  use Ecto.Migration

  def change do
    create table(:challenges, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      add(:challenger_team_id, references(:teams, type: :binary_id, on_delete: :delete_all),
        null: false
      )

      add(:challenged_team_id, references(:teams, type: :binary_id, on_delete: :delete_all),
        null: false
      )

      add(:venue_id, references(:venues, type: :binary_id, on_delete: :delete_all), null: false)

      # pending, accepted, rejected, expired
      add(:status, :string, default: "pending")
      add(:proposed_datetime, :utc_datetime)
      add(:is_ranked, :boolean, default: true)
      add(:message, :text)
      add(:expires_at, :utc_datetime)

      timestamps(type: :utc_datetime)
    end

    create(index(:challenges, [:challenger_team_id]))
    create(index(:challenges, [:challenged_team_id]))
    create(index(:challenges, [:venue_id]))
    create(index(:challenges, [:status]))
  end
end
