defmodule QuadrasWeb.Plugs.AuthPipeline do
  @moduledoc """
  Authentication pipeline for protected API routes.
  """
  use Guardian.Plug.Pipeline,
    otp_app: :quadras,
    module: Quadras.Guardian,
    error_handler: QuadrasWeb.Plugs.AuthErrorHandler

  plug(Guardian.Plug.VerifyHeader, scheme: "Bearer")
  plug(Guardian.Plug.EnsureAuthenticated)
  plug(Guardian.Plug.LoadResource)
end
