defmodule QuadrasWeb.API.V1.VenueJSON do
  @moduledoc """
  JSON rendering for venue responses.
  """
  alias Quadras.Venues.Venue

  def index(%{venues: venues}) do
    %{data: for(venue <- venues, do: venue_data(venue))}
  end

  def nearby(%{venues: venues}) do
    %{data: for(venue <- venues, do: venue_with_distance(venue))}
  end

  def show(%{venue: venue}) do
    %{data: venue_data(venue)}
  end

  def fields(%{fields: fields}) do
    %{data: for(field <- fields, do: field_data(field))}
  end

  def field(%{field: field}) do
    %{data: field_data(field)}
  end

  defp venue_data(venue) do
    base = %{
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      logo_url: venue.logo_url,
      description: venue.description,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zip_code: venue.zip_code,
      opening_time: venue.opening_time,
      closing_time: venue.closing_time,
      hourly_rate: venue.hourly_rate,
      amenities: venue.amenities,
      is_active: venue.is_active,
      admin_id: venue.admin_id,
      coordinates: Venue.get_coordinates(venue),
      fields:
        if(Ecto.assoc_loaded?(venue.fields), do: Enum.map(venue.fields, &field_data/1), else: nil),
      inserted_at: venue.inserted_at
    }

    if Ecto.assoc_loaded?(venue.admin) && venue.admin do
      Map.put(base, :admin, %{
        id: venue.admin.id,
        name: venue.admin.name,
        photo_url: venue.admin.photo_url
      })
    else
      base
    end
  end

  defp venue_with_distance(venue) do
    venue
    |> venue_data()
    |> Map.put(:distance_km, Map.get(venue, :distance_km))
  end

  defp field_data(field) do
    %{
      id: field.id,
      name: field.name,
      sport_type: field.sport_type,
      surface: field.surface,
      player_capacity: field.player_capacity,
      dimensions: field.dimensions,
      is_covered: field.is_covered,
      is_active: field.is_active,
      venue_id: field.venue_id
    }
  end
end
