defmodule Thysis.TagApi do
  @moduledoc """
  The Tags context.
  """

  import Ecto.Query, warn: false
  alias Thysis.Repo

  alias Thysis.Tag

  @doc """
  Returns the list of tags.

  ## Examples

      iex> list()
      [%Tag{}, ...]

  """
  def list do
    Repo.all(Tag)
  end

  @doc """
  Gets a single tag.

  Raises `Ecto.NoResultsError` if the Tag does not exist.

  ## Examples

      iex> get!(123)
      %Tag{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(Tag, id)

  @doc """
  Creates a tag.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Tag{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a tag.

  ## Examples

      iex> update_(tag, %{field: new_value})
      {:ok, %Tag{}}

      iex> update_(tag, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%Tag{} = tag, attrs) do
    tag
    |> Tag.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Tag.

  ## Examples

      iex> delete_(tag)
      {:ok, %Tag{}}

      iex> delete_(tag)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Tag{} = tag) do
    Repo.delete(tag)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking tag changes.

  ## Examples

      iex> change_(tag)
      %Ecto.Changeset{source: %Tag{}}

  """
  def change_(%Tag{} = tag) do
    Tag.changeset(tag, %{})
  end

  @doc """
  Gets a single tag by id or text.

  Returns `nil` if the Tag does not exist.

  ## Examples

      iex> get_tag_by(%{id: 123})
      %Tag{}

      iex> get_tag_by(%{text: "some tag text"})
      %Tag{}

      iex> get_tag_by(%{id: 123, text: "some tag text"})
      %Tag{}

      iex> get_tag_by(456)
      nil

  """
  @spec get_tag_by(
          %{id: String.t() | integer}
          | %{text: String.t()}
          | %{id: String.t() | integer, text: String.t()}
        ) :: %Tag{} | nil
  def get_tag_by(params) do
    Repo.get_by(Tag, params)
  end

  def data() do
    Dataloader.Ecto.new(Thysis.Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
