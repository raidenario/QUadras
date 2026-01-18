defmodule Quadras.Schemas.Lobby do
  @moduledoc """
  Lobby schema representing a queue session for a venue on a specific day.
  Teams join lobbies to find opponents for matches.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "lobbies" do
    field(:reference_date, :date)
    field(:is_active, :boolean, default: true)

    belongs_to(:venue, Quadras.Schemas.Venue)
    has_many(:queue_tickets, Quadras.Schemas.QueueTicket)

    timestamps(type: :utc_datetime)
  end

  @doc """
  Changeset for creating a lobby.
  """
  def changeset(lobby, attrs) do
    lobby
    |> cast(attrs, [:venue_id, :reference_date, :is_active])
    |> validate_required([:venue_id, :reference_date])
    |> unique_constraint([:venue_id, :reference_date])
    |> foreign_key_constraint(:venue_id)
  end
end
