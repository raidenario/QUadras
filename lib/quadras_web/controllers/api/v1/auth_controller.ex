defmodule QuadrasWeb.API.V1.AuthController do
  @moduledoc """
  Authentication controller handling registration, login, and token refresh.
  """
  use QuadrasWeb, :controller

  alias Quadras.Accounts
  alias Quadras.Guardian

  action_fallback(QuadrasWeb.FallbackController)

  @doc """
  Registers a new user.
  POST /api/v1/auth/register
  """
  def register(conn, %{"user" => user_params}) do
    case Accounts.register_user(user_params) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> render(:auth, user: user, token: token)

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Authenticates a user and returns a JWT token.
  POST /api/v1/auth/login
  """
  def login(conn, %{"email" => email, "password" => password}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)

        conn
        |> render(:auth, user: user, token: token)

      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> put_view(json: QuadrasWeb.ErrorJSON)
        |> render(:"401")
    end
  end

  @doc """
  Returns the current authenticated user.
  GET /api/v1/auth/me
  """
  def me(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, :user, user: user)
  end

  @doc """
  Refreshes the JWT token.
  POST /api/v1/auth/refresh
  """
  def refresh(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    {:ok, _old, {new_token, _claims}} = Guardian.refresh(Guardian.Plug.current_token(conn))

    render(conn, :auth, user: user, token: new_token)
  end

  @doc """
  Logs out the user by revoking the token.
  DELETE /api/v1/auth/logout
  """
  def logout(conn, _params) do
    conn
    |> Guardian.Plug.sign_out()
    |> send_resp(:no_content, "")
  end

  @doc """
  Updates the current user's location.
  PUT /api/v1/auth/location
  """
  def update_location(conn, %{"latitude" => lat, "longitude" => lng}) do
    user = Guardian.Plug.current_resource(conn)

    case Accounts.update_user_location(user, lat, lng) do
      {:ok, user} ->
        render(conn, :user, user: user)

      {:error, changeset} ->
        {:error, changeset}
    end
  end
end
