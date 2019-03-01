defmodule Thysis.Accounts do
  require Logger

  import Ecto.Query, warn: false
  import Comeonin.Bcrypt, only: [{:dummy_checkpw, 0}, {:checkpw, 2}]

  alias Thysis.Accounts.Registration
  alias Thysis.Repo
  alias Thysis.Accounts.Credential

  def register(params) do
    Ecto.Multi.new()
    |> Registration.create(params)
    |> Repo.transaction()
    |> case do
      {:ok, %{user: user, credential: credential}} ->
        {:ok,
         Map.put(user, :credential, %{
           credential
           | token: nil,
             password: nil
         })}

      {:error, failed_operations, changeset, _successes} ->
        {:error, failed_operations, changeset}
    end
  end

  def authenticate(%{email: email, password: password} = _params) do
    Logger.info(["\n\nauthenticating with email: ", email])

    Credential
    |> join(:inner, [c], assoc(c, :user))
    |> where([c, u], u.email == ^email)
    |> join(:inner, [c, u], p in assoc(u, :projects))
    |> preload([c, u, p], user: {u, projects: p})
    |> Repo.one()
    |> case do
      nil ->
        Logger.error([
          "\n\ncredentials not found for email: ",
          email,
          ". Invalid email"
        ])

        dummy_checkpw()
        {:error, "Invalid email/password"}

      %Credential{} = cred ->
        if checkpw(password, cred.token) do
          Logger.info([
            "\n\nauthentication succeeds for email: ",
            email
          ])

          {:ok, cred}
        else
          Logger.error([
            "\n\ncredentials error for email: ",
            email,
            ". invalid password: ",
            password,
            " or token: ",
            cred.token
          ])

          {:error, "Invalid email/password"}
        end
    end
  end
end
