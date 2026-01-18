defmodule Quadras.Schemas.QueueTicket do
  @moduledoc """
  Queue ticket schema representing a team's position in a lobby queue.
  Tracks availability window and matching status.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @statuses ~w(waiting negotiating matched left)

  schema "queue_tickets" do
    field(:mmr_snapshot, :decimal)
    field(:entered_at, :utc_datetime)
    field(:available_from, :time)
    field(:available_until, :time)
    field(:status, :string, default: "waiting")
    field(:pending_challenge_id, :binary_id)

    belongs_to(:lobby, Quadras.Schemas.Lobby)
    belongs_to(:team, Quadras.Schemas.Team)

    timestamps(type: :utc_datetime)
  end

  @required_fields ~w(lobby_id team_id)a
  @optional_fields ~w(mmr_snapshot available_from available_until status pending_challenge_id)a

  @doc """
  Changeset for creating/updating a queue ticket.
  """
  def changeset(ticket, attrs) do
    ticket
    |> cast(attrs, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> validate_inclusion(:status, @statuses)
    |> put_entered_at()
    |> unique_constraint([:lobby_id, :team_id])
    |> foreign_key_constraint(:lobby_id)
    |> foreign_key_constraint(:team_id)
  end

  defp put_entered_at(changeset) do
    case get_field(changeset, :entered_at) do
      nil -> put_change(changeset, :entered_at, DateTime.utc_now() |> DateTime.truncate(:second))
      _ -> changeset
    end
  end
end
