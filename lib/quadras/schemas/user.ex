defmodule Quadras.Schemas.User do
  @moduledoc """
  User schema representing an athlete in the platform.
  Tracks personal data, sports context, and reputation metrics.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @dominant_foot_values ~w(destro canhoto ambidestro)

  schema "users" do
    # Personal Data
    field(:name, :string)
    field(:email, :string)
    field(:phone, :string)
    field(:photo_url, :string)
    field(:bio, :string)
    field(:password, :string, virtual: true)
    field(:password_hash, :string)

    # Sports Context
    field(:preferred_position, :string)
    field(:dominant_foot, :string)

    # Reputation
    field(:mmr_individual, :decimal, default: Decimal.new("1000"))
    field(:fair_play_score, :decimal, default: Decimal.new("5.0"))
    field(:mvp_count, :integer, default: 0)
    field(:total_matches, :integer, default: 0)

    # Settings
    field(:search_radius_km, :integer, default: 10)
    field(:notifications_enabled, :boolean, default: true)

    # Location (for nearby venue search)
    field(:latitude, :float)
    field(:longitude, :float)

    # Relationships
    belongs_to(:primary_team, Quadras.Schemas.Team)
    has_many(:team_memberships, Quadras.Schemas.TeamMember)
    has_many(:teams, through: [:team_memberships, :team])
    has_many(:captained_teams, Quadras.Schemas.Team, foreign_key: :captain_id)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(name email password)a
  @optional_fields ~w(phone photo_url bio preferred_position dominant_foot
                       search_radius_km notifications_enabled primary_team_id
                       latitude longitude)a

  @doc """
  Changeset for user registration.
  """
  def registration_changeset(user, attrs) do
    user
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_email()
    |> validate_password()
    |> hash_password()
  end

  @doc """
  Changeset for updating user profile (no password change).
  """
  def profile_changeset(user, attrs) do
    user
    |> cast(attrs, @optional_fields ++ [:name])
    |> validate_dominant_foot()
  end

  @doc """
  Changeset for password change.
  """
  def password_changeset(user, attrs) do
    user
    |> cast(attrs, [:password])
    |> validate_required([:password])
    |> validate_password()
    |> hash_password()
  end

  defp validate_email(changeset) do
    changeset
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
    |> unique_constraint(:email)
  end

  defp validate_password(changeset) do
    changeset
    |> validate_length(:password, min: 6, max: 72)
  end

  defp validate_dominant_foot(changeset) do
    changeset
    |> validate_inclusion(:dominant_foot, @dominant_foot_values)
  end

  defp hash_password(changeset) do
    case get_change(changeset, :password) do
      nil ->
        changeset

      password ->
        changeset
        |> put_change(:password_hash, Bcrypt.hash_pwd_salt(password))
        |> delete_change(:password)
    end
  end

  @doc """
  Verifies the password against the stored hash.
  """
  def valid_password?(%__MODULE__{password_hash: hash}, password) when is_binary(hash) do
    Bcrypt.verify_pass(password, hash)
  end

  def valid_password?(_, _), do: Bcrypt.no_user_verify()
end
