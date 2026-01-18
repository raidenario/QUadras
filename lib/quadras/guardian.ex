defmodule Quadras.Guardian do
  @moduledoc """
  Guardian implementation for JWT authentication.
  """
  use Guardian, otp_app: :quadras

  alias Quadras.Accounts

  @doc """
  Identifies the subject (user) for the token.
  """
  def subject_for_token(%{id: id}, _claims) do
    {:ok, to_string(id)}
  end

  def subject_for_token(_, _) do
    {:error, :no_id_provided}
  end

  @doc """
  Retrieves the resource (user) from the token claims.
  """
  def resource_from_claims(%{"sub" => id}) do
    case Accounts.get_user(id) do
      nil -> {:error, :user_not_found}
      user -> {:ok, user}
    end
  end

  def resource_from_claims(_claims) do
    {:error, :no_subject}
  end
end
