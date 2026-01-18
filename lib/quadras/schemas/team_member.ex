defmodule Quadras.Schemas.TeamMember do
  @moduledoc """
  Team member schema representing the association between a user and a team.
  Users can be captain, member, or reserve.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @roles ~w(captain member reserve)

  schema "team_members" do
    field(:role, :string, default: "member")
    field(:joined_at, :utc_datetime)

    belongs_to(:team, Quadras.Schemas.Team)
    belongs_to(:user, Quadras.Schemas.User)

    timestamps(type: :utc_datetime)
  end

  @doc """
  Changeset for adding a member to a team.
  """
  def changeset(team_member, attrs) do
    team_member
    |> cast(attrs, [:team_id, :user_id, :role, :joined_at])
    |> validate_required([:team_id, :user_id])
    |> validate_inclusion(:role, @roles)
    |> put_joined_at()
    |> unique_constraint([:team_id, :user_id])
    |> foreign_key_constraint(:team_id)
    |> foreign_key_constraint(:user_id)
  end

  defp put_joined_at(changeset) do
    case get_field(changeset, :joined_at) do
      nil -> put_change(changeset, :joined_at, DateTime.utc_now() |> DateTime.truncate(:second))
      _ -> changeset
    end
  end
end
