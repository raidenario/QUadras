defmodule Quadras.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      # Personal Data
      add(:name, :string, null: false)
      add(:email, :string, null: false)
      add(:phone, :string)
      add(:photo_url, :string)
      add(:bio, :text)
      add(:password_hash, :string, null: false)

      # Sports Context
      add(:preferred_position, :string)
      # destro, canhoto, ambidestro
      add(:dominant_foot, :string)

      # Reputation
      add(:mmr_individual, :decimal, default: 1000)
      add(:fair_play_score, :decimal, default: 5.0)
      add(:mvp_count, :integer, default: 0)
      add(:total_matches, :integer, default: 0)

      # Settings
      add(:search_radius_km, :integer, default: 10)
      add(:notifications_enabled, :boolean, default: true)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:users, [:email]))
  end
end
