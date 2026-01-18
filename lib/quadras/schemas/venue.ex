defmodule Quadras.Schemas.Venue do
  @moduledoc """
  Venue schema representing a physical establishment with sports courts.
  Uses PostGIS for geolocation queries (nearby venues).
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "venues" do
    # Identity
    field(:name, :string)
    field(:slug, :string)
    field(:logo_url, :string)
    field(:description, :string)

    # Location (PostGIS)
    field(:location, Geo.PostGIS.Geometry)
    field(:address, :string)
    field(:city, :string)
    field(:state, :string)
    field(:zip_code, :string)

    # Operations
    field(:opening_time, :time)
    field(:closing_time, :time)
    field(:hourly_rate, :decimal)
    field(:amenities, {:array, :string}, default: [])
    field(:is_active, :boolean, default: true)

    # Relationships
    belongs_to(:admin, Quadras.Schemas.User)
    has_many(:fields, Quadras.Schemas.Field)
    has_many(:lobbies, Quadras.Schemas.Lobby)
    has_many(:matches, Quadras.Schemas.Match)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(name)a
  @optional_fields ~w(slug logo_url description address city state zip_code
                       opening_time closing_time hourly_rate amenities is_active admin_id)a

  @doc """
  Changeset for creating a new venue.
  """
  def create_changeset(venue, attrs) do
    venue
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> maybe_put_location(attrs)
    |> generate_slug()
    |> unique_constraint(:slug)
  end

  @doc """
  Changeset for updating a venue.
  """
  def update_changeset(venue, attrs) do
    venue
    |> cast(attrs, @optional_fields ++ [:name])
    |> maybe_put_location(attrs)
    |> maybe_regenerate_slug()
    |> unique_constraint(:slug)
  end

  defp generate_slug(changeset) do
    case get_change(changeset, :name) do
      nil ->
        changeset

      name ->
        slug =
          name
          |> String.downcase()
          |> String.replace(~r/[^a-z0-9\s-]/, "")
          |> String.replace(~r/\s+/, "-")
          |> String.slice(0, 60)

        # Add timestamp to ensure uniqueness
        unique_slug = "#{slug}-#{:os.system_time(:millisecond)}"
        put_change(changeset, :slug, unique_slug)
    end
  end

  defp maybe_regenerate_slug(changeset) do
    if get_change(changeset, :slug) do
      changeset
    else
      changeset
    end
  end

  defp maybe_put_location(changeset, %{lat: lat, lng: lng})
       when is_number(lat) and is_number(lng) do
    point = %Geo.Point{coordinates: {lng, lat}, srid: 4326}
    put_change(changeset, :location, point)
  end

  defp maybe_put_location(changeset, %{"lat" => lat, "lng" => lng})
       when is_binary(lat) or is_number(lat) do
    lat_f = if is_binary(lat), do: String.to_float(lat), else: lat
    lng_f = if is_binary(lng), do: String.to_float(lng), else: lng

    point = %Geo.Point{coordinates: {lng_f, lat_f}, srid: 4326}
    put_change(changeset, :location, point)
  end

  defp maybe_put_location(changeset, _), do: changeset

  @doc """
  Extracts latitude and longitude from the location field.
  """
  def get_coordinates(%__MODULE__{location: %Geo.Point{coordinates: {lng, lat}}}) do
    %{lat: lat, lng: lng}
  end

  def get_coordinates(_), do: nil
end
