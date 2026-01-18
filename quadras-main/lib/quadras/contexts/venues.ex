defmodule Quadras.Contexts.Venues do
  @moduledoc """
  The Venues context.
  Handles venue CRUD and geospatial queries.
  """
  import Ecto.Query, warn: false
  alias Quadras.Repo
  alias Quadras.Schemas.{Venue, Field}

  # =============================================================================
  # Venue CRUD
  # =============================================================================

  @doc """
  Gets a venue by ID.
  """
  def get_venue(id), do: Repo.get(Venue, id)

  @doc """
  Gets a venue by ID with preloads.
  """
  def get_venue!(id, preloads \\ []) do
    Venue
    |> Repo.get!(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Gets a venue by slug.
  """
  def get_venue_by_slug(slug) when is_binary(slug) do
    Repo.get_by(Venue, slug: slug)
  end

  @doc """
  Creates a new venue.
  """
  def create_venue(attrs \\ %{}) do
    %Venue{}
    |> Venue.create_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a venue.
  """
  def update_venue(%Venue{} = venue, attrs) do
    venue
    |> Venue.update_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Lists all venues with optional filters.
  """
  def list_venues(opts \\ []) do
    Venue
    |> where([v], v.is_active == true)
    |> apply_filters(opts)
    |> Repo.all()
  end

  # =============================================================================
  # Geo Queries (PostGIS)
  # =============================================================================

  @doc """
  Finds venues within a given radius (in kilometers) from a point.
  Uses PostGIS ST_DWithin for efficient spatial queries.

  ## Examples

      iex> Venues.find_nearby(-23.550520, -46.633308, 5)
      [%Venue{...}, ...]
  """
  def find_nearby(lat, lng, radius_km, opts \\ []) when is_number(lat) and is_number(lng) do
    # Convert km to meters for PostGIS
    radius_meters = radius_km * 1000

    # Create a point from the coordinates
    point = %Geo.Point{coordinates: {lng, lat}, srid: 4326}

    query =
      from(v in Venue,
        where: v.is_active == true,
        where:
          fragment(
            "ST_DWithin(?::geography, ?::geography, ?)",
            v.location,
            ^point,
            ^radius_meters
          ),
        order_by:
          fragment(
            "ST_Distance(?::geography, ?::geography)",
            v.location,
            ^point
          )
      )

    query
    |> apply_filters(opts)
    |> maybe_limit(opts)
    |> Repo.all()
    |> Enum.map(fn venue ->
      distance = calculate_distance(venue.location, point)
      Map.put(venue, :distance_km, distance)
    end)
  end

  defp calculate_distance(%Geo.Point{coordinates: {lng1, lat1}}, %Geo.Point{
         coordinates: {lng2, lat2}
       }) do
    # Haversine formula for distance calculation
    # Earth's radius in km
    r = 6371

    dlat = deg_to_rad(lat2 - lat1)
    dlng = deg_to_rad(lng2 - lng1)

    a =
      :math.sin(dlat / 2) * :math.sin(dlat / 2) +
        :math.cos(deg_to_rad(lat1)) * :math.cos(deg_to_rad(lat2)) *
          :math.sin(dlng / 2) * :math.sin(dlng / 2)

    c = 2 * :math.atan2(:math.sqrt(a), :math.sqrt(1 - a))

    Float.round(r * c, 2)
  end

  defp calculate_distance(_, _), do: nil

  defp deg_to_rad(deg), do: deg * :math.pi() / 180

  # =============================================================================
  # Fields CRUD
  # =============================================================================

  @doc """
  Gets a field by ID.
  """
  def get_field(id), do: Repo.get(Field, id)

  @doc """
  Gets a field by ID with optional preloads. Raises if not found.
  """
  def get_field!(id, preloads \\ []) do
    Field
    |> Repo.get!(id)
    |> Repo.preload(preloads)
  end

  @doc """
  Creates a new field for a venue.
  """
  def create_field(%Venue{} = venue, attrs) do
    # Normalize all keys to strings to avoid mixed keys error
    string_attrs =
      attrs
      |> Enum.map(fn {k, v} -> {to_string(k), v} end)
      |> Map.new()
      |> Map.put("venue_id", venue.id)

    %Field{}
    |> Field.changeset(string_attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a field.
  """
  def update_field(%Field{} = field, attrs) do
    field
    |> Field.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Lists all fields for a venue.
  """
  def list_fields(%Venue{} = venue) do
    from(f in Field, where: f.venue_id == ^venue.id and f.is_active == true)
    |> Repo.all()
  end

  # =============================================================================
  # Private Helpers
  # =============================================================================

  defp apply_filters(query, []), do: query

  defp apply_filters(query, [{:city, city} | rest]) when is_binary(city) do
    query
    |> where([v], v.city == ^city)
    |> apply_filters(rest)
  end

  defp apply_filters(query, [{:sport_type, sport_type} | rest]) when is_binary(sport_type) do
    query
    |> join(:inner, [v], f in assoc(v, :fields))
    |> where([v, f], f.sport_type == ^sport_type)
    |> distinct([v, f], v.id)
    |> apply_filters(rest)
  end

  defp apply_filters(query, [{:search, term} | rest]) when is_binary(term) do
    pattern = "%#{term}%"

    query
    |> where([v], ilike(v.name, ^pattern) or ilike(v.city, ^pattern))
    |> apply_filters(rest)
  end

  defp apply_filters(query, [_ | rest]), do: apply_filters(query, rest)

  defp maybe_limit(query, opts) do
    case Keyword.get(opts, :limit) do
      nil -> query
      limit when is_integer(limit) -> limit(query, ^limit)
    end
  end
end
