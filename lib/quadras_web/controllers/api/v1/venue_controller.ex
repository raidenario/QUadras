defmodule QuadrasWeb.API.V1.VenueController do
  @moduledoc """
  Venue controller with geo-queries for nearby venues.
  """
  use QuadrasWeb, :controller

  alias Quadras.Venues

  action_fallback(QuadrasWeb.FallbackController)

  @doc """
  Lists venues.
  GET /api/v1/venues
  """
  def index(conn, params) do
    venues = Venues.list_venues(build_filters(params))
    render(conn, :index, venues: venues)
  end

  @doc """
  Finds nearby venues using geolocation.
  GET /api/v1/venues/nearby?lat=XXX&lng=YYY&radius=10
  """
  def nearby(conn, %{"lat" => lat, "lng" => lng} = params) do
    lat = parse_float(lat)
    lng = parse_float(lng)
    radius = parse_float(params["radius"] || "10")

    venues = Venues.find_nearby(lat, lng, radius, build_filters(params))
    render(conn, :nearby, venues: venues)
  end

  @doc """
  Shows a venue with its fields.
  GET /api/v1/venues/:id
  """
  def show(conn, %{"id" => id}) do
    venue = Venues.get_venue!(id, [:fields, :admin])
    render(conn, :show, venue: venue)
  end

  @doc """
  Creates a new venue.
  POST /api/v1/venues
  """
  def create(conn, %{"venue" => venue_params}) do
    case Venues.create_venue(venue_params) do
      {:ok, venue} ->
        conn
        |> put_status(:created)
        |> render(:show, venue: venue)

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Updates a venue.
  PUT /api/v1/venues/:id
  """
  def update(conn, %{"id" => id, "venue" => venue_params}) do
    venue = Venues.get_venue!(id)

    case Venues.update_venue(venue, venue_params) do
      {:ok, venue} ->
        render(conn, :show, venue: venue)

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Lists fields for a venue.
  GET /api/v1/venues/:venue_id/fields
  """
  def list_fields(conn, %{"venue_id" => venue_id}) do
    venue = Venues.get_venue!(venue_id)
    fields = Venues.list_fields(venue)
    render(conn, :fields, fields: fields)
  end

  @doc """
  Creates a field for a venue.
  POST /api/v1/venues/:venue_id/fields
  """
  def create_field(conn, %{"venue_id" => venue_id, "field" => field_params}) do
    venue = Venues.get_venue!(venue_id)

    case Venues.create_field(venue, field_params) do
      {:ok, field} ->
        conn
        |> put_status(:created)
        |> render(:field, field: field)

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  defp build_filters(params) do
    []
    |> maybe_add_filter(:city, params["city"])
    |> maybe_add_filter(:sport_type, params["sport_type"])
    |> maybe_add_filter(:search, params["q"])
    |> maybe_add_filter(:limit, params["limit"] && String.to_integer(params["limit"]))
  end

  defp maybe_add_filter(filters, _key, nil), do: filters
  defp maybe_add_filter(filters, key, value), do: [{key, value} | filters]

  defp parse_float(str) when is_binary(str), do: String.to_float(str)
  defp parse_float(num) when is_number(num), do: num
end
