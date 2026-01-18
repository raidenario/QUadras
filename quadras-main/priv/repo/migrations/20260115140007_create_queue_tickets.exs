defmodule Quadras.Repo.Migrations.CreateQueueTickets do
  use Ecto.Migration

  def change do
    create table(:queue_tickets, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:lobby_id, references(:lobbies, type: :binary_id, on_delete: :delete_all), null: false)
      add(:team_id, references(:teams, type: :binary_id, on_delete: :delete_all), null: false)

      add(:mmr_snapshot, :decimal)
      add(:entered_at, :utc_datetime)
      add(:available_from, :time)
      add(:available_until, :time)
      # waiting, negotiating, matched, left
      add(:status, :string, default: "waiting")
      add(:pending_challenge_id, :binary_id)

      timestamps(type: :utc_datetime)
    end

    create(index(:queue_tickets, [:lobby_id]))
    create(index(:queue_tickets, [:status]))
    create(unique_index(:queue_tickets, [:lobby_id, :team_id]))
  end
end
