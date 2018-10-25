defmodule Thises.Accounts.Registration do
  use Ecto.Schema

  import Ecto.Changeset

  alias Ecto.Multi
  alias Thises.Accounts.User
  alias Thises.Accounts.UserApi
  alias Thises.Accounts.Credential
  alias Thises.Accounts.CredentialApi

  @required_fields [
    :name,
    :email,
    :source,
    :password
  ]

  embedded_schema do
    field(:name, :string)
    field(:email, :string)
    field(:source, :string)
    field(:password, :string)
    field(:password_confirmation, :string)
  end

  @doc ~S"""
     changeset
  """
  def changeset(%__MODULE__{} = reg, params \\ %{}) do
    reg
    |> cast(params, @required_fields)
    |> validate_length(:password, min: 4, max: 200)
    |> validate_confirmation(:password)
    |> User.validate_create()
    |> Credential.validate()
  end

  def validate(_changes, params) do
    changes = changeset(%__MODULE__{}, params)

    case changes.valid? do
      true ->
        {:ok, changes}

      _ ->
        {:error, apply_action(changes, :insert)}
    end
  end

  def insert_user(_changes, params), do: UserApi.create_(params)

  def insert_credential(%{user: user}, params),
    do:
      user
      |> Ecto.build_assoc(:credential)
      |> Credential.changeset(params)
      |> CredentialApi.create_()

  def create(multi, params) do
    multi
    |> Multi.run(:registration, __MODULE__, :validate, [params])
    |> Multi.run(:user, __MODULE__, :insert_user, [params])
    |> Multi.run(:credential, __MODULE__, :insert_credential, [params])
  end
end
