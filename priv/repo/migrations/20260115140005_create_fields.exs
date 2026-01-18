defmodule Quadras.Repo.Migrations.CreateFields do
  use Ecto.Migration

  def change do
    create table(:fields, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:venue_id, references(:venues, type: :binary_id, on_delete: :delete_all), null: false)

      # "Quadra 1 - Society"
      add(:name, :string, null: false)
      # futsal, society, basketball, volleyball
      add(:sport_type, :string, null: false)
      # synthetic_grass, wood, concrete, sand
      add(:surface, :string)
      # 5 for 5v5
      add(:player_capacity, :integer)
      add(:dimensions, :string)
      add(:is_covered, :boolean, default: false)
      add(:is_active, :boolean, default: true)

      timestamps(type: :utc_datetime)
    end

    create(index(:fields, [:venue_id]))
    create(index(:fields, [:sport_type]))
    create(index(:fields, [:is_active]))
  end
end
