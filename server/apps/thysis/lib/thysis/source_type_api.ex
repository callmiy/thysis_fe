defmodule Thysis.SourceTypeApi do
  @moduledoc """
  The SourceTypes context.
  """

  import Ecto.Query, warn: false
  alias Thysis.Repo

  alias Thysis.SourceType

  @doc """
  Returns the list of source_types.

  ## Examples

      iex> list()
      [%SourceType{}, ...]

  """
  def list(user_id) do
    SourceType
    |> where([s], s.user_id == ^user_id)
    |> Repo.all()
  end

  def list, do: Repo.all(SourceType)

  @doc """
  Gets a single source_type.

  Raises `Ecto.NoResultsError` if the Source type does not exist.

  ## Examples

      iex> get!(123)
      %SourceType{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(SourceType, id)

  @doc """
  Creates a source_type.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %SourceType{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %SourceType{}
    |> SourceType.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a source_type.

  ## Examples

      iex> update_(source_type, %{field: new_value})
      {:ok, %SourceType{}}

      iex> update_(source_type, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%SourceType{} = source_type, attrs) do
    source_type
    |> SourceType.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a SourceType.

  ## Examples

      iex> delete_(source_type)
      {:ok, %SourceType{}}

      iex> delete_(source_type)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%SourceType{} = source_type) do
    Repo.delete(source_type)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking source_type changes.

  ## Examples

      iex> change_(source_type)
      %Ecto.Changeset{source: %SourceType{}}

  """
  def change_(source_type, attrs \\ %{})

  def change_(source_type, %SourceType{} = attrs) do
    SourceType.changeset(source_type, Map.from_struct(attrs))
  end

  def change_(%SourceType{} = source_type, attrs) do
    SourceType.changeset(source_type, attrs)
  end

  @doc """
  Gets a single source_type by id or name.

  Returns `nil` if the SourceType does not exist.

  ## Examples

      iex> get_source_type_by(%{id: 123})
      %SourceType{}

      iex> get_source_type_by(%{name: "some source type name"})
      %SourceType{}

      iex> get_source_type_by(%{id: 123, name: "some source type name"})
      %SourceType{}

      iex> get_source_type_by(456)
      nil

  """

  def get_source_type_by(params, user_id) do
    SourceType
    |> where([s], s.user_id == ^user_id)
    |> where_by(params)
    |> Repo.one()
  end

  defp where_by(query, %{id: id}),
    do: where(query, [s], s.id == ^id)

  defp where_by(query, %{name: name}),
    do: where(query, [s], s.name == ^name)

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
