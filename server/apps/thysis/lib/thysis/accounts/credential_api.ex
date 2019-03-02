defmodule Thysis.Accounts.CredentialApi do
  import Ecto.Query, warn: false

  alias Thysis.Repo
  alias Thysis.Accounts.Credential

  @doc """
  Returns the list of credentials.

  ## Examples

      iex> list()
      [%Credential{}, ...]

  """
  def list do
    Repo.all(Credential)
  end

  @doc """
  Creates a credential.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Credential{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(%Ecto.Changeset{} = changes) do
    Repo.insert(changes)
  end

  def create_(attrs) do
    %Credential{}
    |> Credential.changeset(attrs)
    |> create_()
  end

  @doc """
  Deletes a Credential.

  ## Examples

      iex> delete_(credential)
      {:ok, %Credential{}}

      iex> delete_(credential)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Credential{} = credential) do
    Repo.delete(credential)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking credential changes.

  ## Examples

      iex> change_(credential, %{})
      %Ecto.Changeset{source: %Credential{}}

  """
  def change_(%Credential{} = credential, attrs \\ %{}) do
    Credential.changeset(credential, attrs)
  end

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
