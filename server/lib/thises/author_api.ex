defmodule Thysis.AuthorApi do
  @moduledoc """
  The Authors context.
  """

  import Ecto.Query, warn: false
  alias Thysis.Repo

  alias Thysis.Author

  @doc """
  Returns the list of authors.

  ## Examples

      iex> list()
      [%Author{}, ...]

  """
  def list, do: Repo.all(Author)

  def list(ids) when is_list(ids) do
    Author
    |> where([a], a.id in ^ids)
    |> Repo.all()
  end

  def list(%{} = attrs) do
    attrs
    |> Enum.reduce(Author, &where_by/2)
    |> Repo.all()
  end

  defp where_by({:user_id, user_id}, query) do
    where(query, [a], a.user_id == ^user_id)
  end

  defp where_by({:project_id, project_id}, query) do
    where(query, [a], a.project_id == ^project_id)
  end

  defp where_by(_, query), do: query

  @doc """
  Gets a single author.

  Raises `Ecto.NoResultsError` if the Author does not exist.

  ## Examples

      iex> get!(123)
      %Author{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """

  def get!(id), do: Repo.get!(Author, id)
  def get(id), do: Repo.get(Author, id)

  def get(author_id, user_id) do
    Author
    |> where([a], a.id == ^author_id and a.user_id == ^user_id)
    |> Repo.one()
  end

  @doc """
  Creates a author.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Author{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    attrs =
      attrs
      |> Enum.map(fn
        {k, nil} ->
          {k, nil}

        {k, v} when k in [:first_name, :middle_name, :last_name] ->
          {k, v |> String.trim() |> String.capitalize()}

        others ->
          others
      end)
      |> Enum.into(%{})

    %Author{}
    |> Author.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a author.

  ## Examples

      iex> update_(author, %{field: new_value})
      {:ok, %Author{}}

      iex> update_(author, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%Author{} = author, attrs) do
    author
    |> Author.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Author.

  ## Examples

      iex> delete_(author)
      {:ok, %Author{}}

      iex> delete_(author)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Author{} = author) do
    Repo.delete(author)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking author changes.

  ## Examples

      iex> change_(author)
      %Ecto.Changeset{source: %Author{}}

  """
  def change_(%Author{} = author, attrs \\ %{}) do
    Author.changeset(author, attrs)
  end

  @doc """
  Get an author either by name or id or both.
  """
  def get_author_by(params) do
    Repo.get_by(Author, params)
  end

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
