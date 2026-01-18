defmodule Quadras.Repo.Migrations.CreateLobbies do
  use Ecto.Migration

  def change do
    create table(:lobbies, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:venue_id, references(:venues, type: :binary_id, on_delete: :delete_all), null: false)
      add(:reference_date, :date, null: false)
      add(:is_active, :boolean, default: true)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:lobbies, [:venue_id, :reference_date]))
    create(index(:lobbies, [:is_active]))
  end
end
