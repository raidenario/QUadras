defmodule Quadras.Schemas.Challenge do
  @moduledoc """
  Challenge schema representing a match invitation between two teams.
  Lifecycle: pending -> accepted/rejected/expired
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @statuses ~w(pending accepted rejected expired cancelled)

  schema "challenges" do
    field(:status, :string, default: "pending")
    field(:proposed_datetime, :utc_datetime)
    field(:is_ranked, :boolean, default: true)
    field(:message, :string)
    field(:expires_at, :utc_datetime)

    belongs_to(:challenger_team, Quadras.Schemas.Team)
    belongs_to(:challenged_team, Quadras.Schemas.Team)
    belongs_to(:venue, Quadras.Schemas.Venue)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(challenger_team_id challenged_team_id venue_id)a
  @optional_fields ~w(status proposed_datetime is_ranked message expires_at)a

  @doc """
  Changeset for creating a challenge.
  """
  def create_changeset(challenge, attrs) do
    challenge
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_different_teams()
    |> put_expiration()
    |> foreign_key_constraint(:challenger_team_id)
    |> foreign_key_constraint(:challenged_team_id)
    |> foreign_key_constraint(:venue_id)
  end

  @doc """
  Changeset for updating challenge status.
  """
  def status_changeset(challenge, status) when status in @statuses do
    challenge
    |> change(status: status)
  end

  defp validate_different_teams(changeset) do
    challenger_id = get_field(changeset, :challenger_team_id)
    challenged_id = get_field(changeset, :challenged_team_id)

    if challenger_id && challenged_id && challenger_id == challenged_id do
      add_error(changeset, :challenged_team_id, "cannot challenge your own team")
    else
      changeset
    end
  end

  defp put_expiration(changeset) do
    case get_field(changeset, :expires_at) do
      nil ->
        # Default: expires in 1 hour
        expires_at =
          DateTime.utc_now() |> DateTime.add(3600, :second) |> DateTime.truncate(:second)

        put_change(changeset, :expires_at, expires_at)

      _ ->
        changeset
    end
  end
end
