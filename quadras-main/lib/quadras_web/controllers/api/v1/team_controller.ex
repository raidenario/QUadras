defmodule QuadrasWeb.API.V1.TeamController do
  @moduledoc """
  Team management controller.
  """
  use QuadrasWeb, :controller

  alias Quadras.Teams
  alias Quadras.Guardian

  action_fallback(QuadrasWeb.FallbackController)

  @doc """
  Lists all teams.
  GET /api/v1/teams
  """
  def index(conn, params) do
    teams = Teams.list_teams(build_filters(params))
    render(conn, :index, teams: teams)
  end

  @doc """
  Shows a specific team.
  GET /api/v1/teams/:id
  """
  def show(conn, %{"id" => id}) do
    team = Teams.get_team!(id, [:captain, :members])
    render(conn, :show, team: team)
  end

  @doc """
  Gets the current user's primary team.
  GET /api/v1/teams/me
  """
  def my_team(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)

    case Quadras.Accounts.get_user_primary_team(current_user) do
      {:ok, team} ->
        team = Teams.get_team!(team.id, [:captain, :members])
        render(conn, :show, team: team)

      {:error, :no_team} ->
        conn
        |> put_status(:not_found)
        |> put_view(json: QuadrasWeb.ErrorJSON)
        |> render(:error, message: "User has no team")
    end
  end

  @doc """
  Gets all teams the current user belongs to.
  GET /api/v1/teams/my-teams
  """
  def my_teams(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    teams = Quadras.Accounts.get_user_teams(current_user)
    render(conn, :index, teams: teams)
  end

  @doc """
  Creates a new team.
  POST /api/v1/teams
  """
  def create(conn, %{"team" => team_params}) do
    current_user = Guardian.Plug.current_resource(conn)

    case Teams.create_team(current_user, team_params) do
      {:ok, team} ->
        conn
        |> put_status(:created)
        |> render(:show, team: team)

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Updates a team.
  PUT /api/v1/teams/:id
  """
  def update(conn, %{"id" => id, "team" => team_params}) do
    current_user = Guardian.Plug.current_resource(conn)
    team = Teams.get_team!(id)

    case Teams.update_team(team, current_user, team_params) do
      {:ok, team} ->
        render(conn, :show, team: team)

      {:error, :not_captain} ->
        conn
        |> put_status(:forbidden)
        |> put_view(json: QuadrasWeb.ErrorJSON)
        |> render(:"403")

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Adds a member to a team.
  POST /api/v1/teams/:id/members
  """
  def add_member(conn, %{"id" => id, "user_id" => user_id}) do
    team = Teams.get_team!(id)
    user = Quadras.Accounts.get_user!(user_id)

    case Teams.add_member(team, user) do
      {:ok, _member} ->
        send_resp(conn, :created, "")

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @doc """
  Removes a member from a team.
  DELETE /api/v1/teams/:id/members/:user_id
  """
  def remove_member(conn, %{"id" => id, "user_id" => user_id}) do
    team = Teams.get_team!(id)
    user = Quadras.Accounts.get_user!(user_id)

    case Teams.remove_member(team, user) do
      :ok ->
        send_resp(conn, :no_content, "")

      {:error, :cannot_remove_captain} ->
        conn
        |> put_status(:bad_request)
        |> put_view(json: QuadrasWeb.ErrorJSON)
        |> render(:error, message: "Cannot remove captain from team")
    end
  end

  defp build_filters(params) do
    []
    |> maybe_add_filter(:rank_tier, params["rank_tier"])
    |> maybe_add_filter(:search, params["q"])
  end

  defp maybe_add_filter(filters, _key, nil), do: filters
  defp maybe_add_filter(filters, key, value), do: [{key, value} | filters]
end
