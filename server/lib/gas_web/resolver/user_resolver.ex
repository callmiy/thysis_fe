defmodule GasWeb.UserResolver do
  alias Gas.Accounts
  alias GasWeb.Resolver
  alias GasWeb.Auth.Guardian, as: GuardianApp
  alias Gas.Accounts.UserApi

  def create(_root, %{registration: params}, _info) do
    with {:ok, user} <- Accounts.register(params),
         {:ok, jwt, _claim} <- GuardianApp.encode_and_sign(user) do
      {:ok,
       user
       |> Map.from_struct()
       |> Map.merge(%{
         jwt: jwt,
         _rev: "my_exp_rev"
       })}
    else
      {:error, failed_operations, changeset} ->
        {
          :error,
          Resolver.transaction_errors_to_string(changeset, failed_operations)
        }

      error ->
        {:error, inspect(error)}
    end
  end

  def update(_, %{user: %{jwt: jwt} = params}, _info) do
    with {:ok, user, _claim} <- GuardianApp.resource_from_token(jwt),
         {:ok, created_user} <- UserApi.update_(user, params) do
      {
        :ok,
        created_user
        |> Map.from_struct()
        |> Map.put(:jwt, jwt)
      }
    else
      {:error, %Ecto.Changeset{} = error} ->
        {:error, Resolver.changeset_errors_to_string(error)}

      _ ->
        Resolver.unauthorized()
    end
  end

  def login(_root, %{login: params}, _info) do
    with {:ok, %{user: user}} <- Accounts.authenticate(params),
         {:ok, jwt, _claim} <- GuardianApp.encode_and_sign(user) do
      {:ok,
       user
       |> Map.from_struct()
       |> Map.merge(%{
         jwt: jwt
       })}
    else
      {:error, errs} ->
        {
          :error,
          Poison.encode!(%{
            error: errs
          })
        }
    end
  end
end
