defmodule Quadras.Repo do
  use Ecto.Repo,
    otp_app: :quadras,
    adapter: Ecto.Adapters.Postgres
end
