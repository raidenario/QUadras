defmodule Quadras.Contexts.Accounts do
  @moduledoc """
  The Accounts context.
  Handles user authentication, registration, and profile management.
  """
  import Ecto.Query, warn: false
  alias Quadras.Repo
  alias Quadras.Schemas.User

  @doc """
  Gets a user by ID.
  """
  def get_user(id), do: Repo.get(User, id)

  @doc """
  Gets a user by ID, raises if not found.
  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Gets a user by email.
  """
  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: String.downcase(email))
  end

  @doc """
  Authenticates a user by email and password.
  """
  def authenticate_user(email, password) do
    user = get_user_by_email(email)

    cond do
      user && User.valid_password?(user, password) ->
        {:ok, user}

      user ->
        {:error, :invalid_password}

      true ->
        # Prevent timing attacks
        Bcrypt.no_user_verify()
        {:error, :not_found}
    end
  end

  @doc """
  Registers a new user.
  """
  def register_user(attrs \\ %{}) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user's profile.
  """
  def update_user_profile(%User{} = user, attrs) do
    user
    |> User.profile_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Changes a user's password.
  """
  def change_user_password(%User{} = user, attrs) do
    user
    |> User.password_changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Returns a changeset for registration.
  """
  def change_user_registration(%User{} = user, attrs \\ %{}) do
    User.registration_changeset(user, attrs)
  end

  @doc """
  Lists users with optional filters.
  """
  def list_users(opts \\ []) do
    User
    |> apply_filters(opts)
    |> Repo.all()
  end

  defp apply_filters(query, []), do: query

  defp apply_filters(query, [{:team_id, team_id} | rest]) do
    query
    |> join(:inner, [u], tm in assoc(u, :team_memberships))
    |> where([u, tm], tm.team_id == ^team_id)
    |> apply_filters(rest)
  end

  defp apply_filters(query, [_ | rest]), do: apply_filters(query, rest)

  @doc """
  Updates user reputation after a match.
  """
  def update_reputation(%User{} = user, attrs) do
    user
    |> Ecto.Changeset.change(attrs)
    |> Repo.update()
  end

  @doc """
  Gets all teams the user is a member of.
  """
  def get_user_teams(%User{} = user) do
    user
    |> Repo.preload(teams: [:captain])
    |> Map.get(:teams)
  end

  @doc """
  Gets the user's primary team (first team they captain, or first team they're member of).
  """
  def get_user_primary_team(%User{} = user) do
    user = Repo.preload(user, [:primary_team, :captained_teams, :teams])

    cond do
      # If user has a primary_team set, return it
      user.primary_team != nil ->
        {:ok, user.primary_team}

      # If user captains a team, return the first one
      length(user.captained_teams) > 0 ->
        {:ok, List.first(user.captained_teams)}

      # If user is member of any team, return the first one
      length(user.teams) > 0 ->
        {:ok, List.first(user.teams)}

      # User has no team
      true ->
        {:error, :no_team}
    end
  end

  @doc """
  Updates the user's current location.
  """
  def update_user_location(%User{} = user, latitude, longitude) do
    user
    |> Ecto.Changeset.change(%{latitude: latitude, longitude: longitude})
    |> Repo.update()
  end
end
