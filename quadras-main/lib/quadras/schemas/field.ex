defmodule Quadras.Schemas.Field do
  @moduledoc """
  Field schema representing a specific playing area within a venue.
  Each venue can have multiple fields (e.g., "Quadra 1", "Quadra 2").
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @sport_types ~w(futsal society campo basquete volei beach_tennis padel)
  @surfaces ~w(grama_sintetica madeira concreto areia piso_esportivo)

  schema "fields" do
    field(:name, :string)
    field(:sport_type, :string)
    field(:surface, :string)
    field(:player_capacity, :integer)
    field(:dimensions, :string)
    field(:is_covered, :boolean, default: false)
    field(:is_active, :boolean, default: true)

    # Scheduling configuration
    field(:slot_duration_minutes, :integer, default: 60)
    field(:opening_time, :time)
    field(:closing_time, :time)

    belongs_to(:venue, Quadras.Schemas.Venue)
    has_many(:matches, Quadras.Schemas.Match)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(name sport_type venue_id)a
  @optional_fields ~w(surface player_capacity dimensions is_covered is_active
                      slot_duration_minutes opening_time closing_time)a

  @doc """
  Changeset for creating/updating a field.
  """
  def changeset(field, attrs) do
    field
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_inclusion(:sport_type, @sport_types)
    |> validate_inclusion(:surface, @surfaces)
    |> validate_number(:player_capacity, greater_than: 0, less_than_or_equal_to: 22)
    |> validate_number(:slot_duration_minutes, greater_than: 0, less_than_or_equal_to: 180)
    |> foreign_key_constraint(:venue_id)
  end

  @doc """
  Gets the effective opening time (field override or venue default).
  """
  def effective_opening_time(%__MODULE__{opening_time: nil, venue: %{opening_time: venue_time}}), do: venue_time
  def effective_opening_time(%__MODULE__{opening_time: time}), do: time

  @doc """
  Gets the effective closing time (field override or venue default).
  """
  def effective_closing_time(%__MODULE__{closing_time: nil, venue: %{closing_time: venue_time}}), do: venue_time
  def effective_closing_time(%__MODULE__{closing_time: time}), do: time
end
