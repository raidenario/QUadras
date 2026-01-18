defmodule Quadras.Repo.Migrations.AddSchedulingFields do
  use Ecto.Migration

  def change do
    # Add scheduling fields to fields table
    alter table(:fields) do
      add :slot_duration_minutes, :integer, default: 60
      add :opening_time, :time
      add :closing_time, :time
    end

    # Add scheduling fields to matches table
    alter table(:matches) do
      add :slot_start, :utc_datetime
      add :slot_end, :utc_datetime
    end

    # Create unique partial index to prevent race conditions
    # Only active matches (not cancelled) can occupy a slot
    create unique_index(:matches, [:field_id, :slot_start],
      where: "status != 'cancelled'",
      name: :matches_field_slot_unique
    )
  end
end
