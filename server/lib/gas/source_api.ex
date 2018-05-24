defmodule Gas.SourceApi do
  @moduledoc """
  The Sources context.
  """

  import Ecto.Query, warn: false
  alias Gas.Repo

  alias Gas.Source

  @doc """
  Returns the list of sources.

  ## Examples

      iex> list()
      [%Source{}, ...]

  """
  def list do
    Repo.all(Source)
  end

  @doc """
  Gets a single source.

  Raises `Ecto.NoResultsError` if the Source does not exist.

  ## Examples

      iex> get!(123)
      %Source{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(Source, id)

  @doc """
  Creates a source.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Source{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %Source{}
    |> Source.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a source.

  ## Examples

      iex> update_(source, %{field: new_value})
      {:ok, %Source{}}

      iex> update_(source, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%Source{} = source, attrs) do
    source
    |> Source.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Source.

  ## Examples

      iex> delete_(source)
      {:ok, %Source{}}

      iex> delete_(source)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Source{} = source) do
    Repo.delete(source)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking source changes.

  ## Examples

      iex> change_(source)
      %Ecto.Changeset{source: %Source{}}

  """
  def change_(%Source{} = source) do
    Source.changeset(source, %{})
  end
end
