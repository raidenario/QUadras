defmodule QuadrasWeb.HealthController do
  @moduledoc """
  Health check endpoint for monitoring.
  """
  use QuadrasWeb, :controller

  def check(conn, _params) do
    conn
    |> put_status(:ok)
    |> json(%{status: "ok", timestamp: DateTime.utc_now()})
  end
end
