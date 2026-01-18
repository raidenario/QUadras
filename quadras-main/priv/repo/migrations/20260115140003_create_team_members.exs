defmodule Quadras.Repo.Migrations.CreateTeamMembers do
  use Ecto.Migration

  def change do
    create table(:team_members, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:team_id, references(:teams, type: :binary_id, on_delete: :delete_all), null: false)
      add(:user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false)
      # captain, member, reserve
      add(:role, :string, default: "member")
      add(:joined_at, :utc_datetime)

      timestamps(type: :utc_datetime)
    end

    create(unique_index(:team_members, [:team_id, :user_id]))
    create(index(:team_members, [:user_id]))
  end
end
