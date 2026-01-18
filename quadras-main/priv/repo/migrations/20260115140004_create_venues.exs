defmodule Quadras.Repo.Migrations.CreateVenues do
  use Ecto.Migration

  def change do
    create table(:venues, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      # Identity
      add(:name, :string, null: false)
      add(:slug, :string, null: false)
      add(:logo_url, :string)
      add(:description, :text)

      # Location (PostGIS)
      # Point type with SRID 4326
      add(:location, :geometry)
      add(:address, :string)
      add(:city, :string)
      add(:state, :string)
      add(:zip_code, :string)

      # Management
      add(:admin_id, references(:users, type: :binary_id, on_delete: :nilify_all))

      # Operations
      add(:opening_time, :time)
      add(:closing_time, :time)
      add(:hourly_rate, :decimal)
      add(:amenities, {:array, :string}, default: [])
      add(:is_active, :boolean, default: true)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:venues, [:slug]))
    create(index(:venues, [:admin_id]))
    create(index(:venues, [:city]))
    create(index(:venues, [:is_active]))

    # PostGIS spatial index for geo queries
    create(index(:venues, [:location], using: :gist))
  end
end
