defmodule Gas.Accounts.User do
  use Ecto.Schema
  use Timex.Ecto.Timestamps

  import Ecto.Changeset

  alias Ecto.Changeset
  alias Gas.Accounts.Credential

  schema "users" do
    field(:_rev, :string)
    field(:email, :string)
    field(:name, :string)

    has_one(:credential, Credential)
    timestamps()
  end

  @doc "changeset"
  def changeset(%__MODULE__{} = user, attrs \\ %{}) do
    user
    |> cast(attrs, [:name, :email])
    |> validate()
  end

  @doc "Validation for new user"
  def validate_create(changes),
    do:
      %{changes | data: %__MODULE__{}}
      |> validate()

  defp validate(%Changeset{} = changes) do
    changes
    |> validate_required([:name, :email])
    |> validate_length(:name, min: 3, max: 20)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
