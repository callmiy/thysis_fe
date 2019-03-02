defmodule Thysis.Accounts do
  require Logger

  import Ecto.Query, warn: false
  import Comeonin.Bcrypt, only: [{:dummy_checkpw, 0}, {:checkpw, 2}]

  alias Thysis.Accounts.Registration
  alias Thysis.Repo
  alias Thysis.Accounts.Credential
  alias Thysis.Accounts.User

  @recovery_token_expires_hours 24

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
    Logger.info(fn -> ["authenticating with email: ", email] end)

    Credential
    |> join(:inner, [c], assoc(c, :user))
    |> where([c, u], u.email == ^email)
    |> join(:inner, [c, u], p in assoc(u, :projects))
    |> preload([c, u, p], user: {u, projects: p})
    |> Repo.one()
    |> case do
      nil ->
        Logger.error(fn ->
          [
            "Credentials not found for email: ",
            email,
            ". Invalid email"
          ]
        end)

        dummy_checkpw()
        {:error, "Invalid email/password"}

      %Credential{} = cred ->
        if checkpw(password, cred.token) do
          Logger.info(fn ->
            [
              "Authentication succeeds for email: ",
              email
            ]
          end)

          {:ok, cred}
        else
          Logger.error(fn ->
            [
              "Credentials error for email: ",
              email,
              ". Invalid password"
            ]
          end)

          {:error, "Invalid email/password"}
        end
    end
  end

  ####################### USER ##############################

  def get_by_user(params), do: Repo.get_by(User, params)

  def get_user_for_pwd_recovery(email) do
    User
    |> where([u], u.email == ^email)
    |> join(:inner, [u], c in assoc(u, :credential))
    |> preload([u, c], credential: c)
    |> Repo.one()
  end

  ########################### CREDENTIAL ##################################
  @doc """
  Gets a single credential.

  Raises `Ecto.NoResultsError` if the Credential does not exist.

  ## Examples

      iex> get_credential(123)
      %Credential{}

      iex> get_credential(456)
      ** nil

  """
  def get_credential(id), do: Repo.get(Credential, id)

  @doc """
  Updates a credential.

  ## Examples

      iex> update_credential(credential, %{field: new_value})
      {:ok, %Credential{}}

      iex> update_credential(credential, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """

  def update_credential(%Credential{} = credential, attrs) do
    credential
    |> Credential.changeset(attrs)
    |> Repo.update()
  end

  @spec create_pwd_recovery_token(
          credential :: Thysis.Accounts.Credential.t(),
          email :: String.t(),
          token :: String.t()
        ) :: :ok | {:error, %Ecto.Changeset{}}
  def create_pwd_recovery_token(%Credential{} = cred, email, token) do
    with {:ok, _} <-
           update_credential(cred, %{
             pwd_recovery_token: token,
             pwd_recovery_token_expires_at:
               Timex.now()
               |> Timex.shift(hours: @recovery_token_expires_hours)
           }),
         do: TyEmails.send_password_recovery(email, token)
  end
end
