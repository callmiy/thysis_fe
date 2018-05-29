defmodule Gas.QuoteTagApi do
  @moduledoc """
  The QuoteTags context.
  """

  import Ecto.Query, warn: false
  alias Gas.Repo

  alias Gas.QuoteTag

  @doc """
  Returns the list of source_tags.

  ## Examples

      iex> list()
      [%QuoteTag{}, ...]

  """
  def list do
    Repo.all(QuoteTag)
  end

  @doc """
  Gets a single source_tag.

  Raises `Ecto.NoResultsError` if the Source tag does not exist.

  ## Examples

      iex> get!(123)
      %QuoteTag{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(QuoteTag, id)

  @doc """
  Creates a source_tag.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %QuoteTag{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %QuoteTag{}
    |> QuoteTag.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a source_tag.

  ## Examples

      iex> update_(source_tag, %{field: new_value})
      {:ok, %QuoteTag{}}

      iex> update_(source_tag, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%QuoteTag{} = source_tag, attrs) do
    source_tag
    |> QuoteTag.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a QuoteTag.

  ## Examples

      iex> delete_(source_tag)
      {:ok, %QuoteTag{}}

      iex> delete_(source_tag)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%QuoteTag{} = source_tag) do
    Repo.delete(source_tag)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking source_tag changes.

  ## Examples

      iex> change_(source_tag)
      %Ecto.Changeset{source: %QuoteTag{}}

  """
  def change_(%QuoteTag{} = source_tag) do
    QuoteTag.changeset(source_tag, %{})
  end
end
