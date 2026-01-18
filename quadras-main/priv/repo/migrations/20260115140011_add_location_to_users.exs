defmodule Quadras.Repo.Migrations.AddLocationToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:latitude, :float)
      add(:longitude, :float)
    end

    # Create spatial index for user location queries
    create(index(:users, [:latitude, :longitude]))
  end
end
