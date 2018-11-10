defmodule Thysis.QuoteTagApi do
  @moduledoc """
  The QuoteTags context.
  """

  import Ecto.Query, warn: false
  alias Thysis.Repo

  alias Thysis.QuoteTag

  @doc """
  Returns the list of quote_tags.

  ## Examples

      iex> list()
      [%QuoteTag{}, ...]

  """
  def list do
    Repo.all(QuoteTag)
  end

  @doc """
  Gets a single quote_tag.

  Raises `Ecto.NoResultsError` if the Source tag does not exist.

  ## Examples

      iex> get!(123)
      %QuoteTag{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(QuoteTag, id)

  @doc """
  Creates a quote_tag.

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
  Updates a quote_tag.

  ## Examples

      iex> update_(quote_tag, %{field: new_value})
      {:ok, %QuoteTag{}}

      iex> update_(quote_tag, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%QuoteTag{} = quote_tag, attrs) do
    quote_tag
    |> QuoteTag.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a QuoteTag.

  ## Examples

      iex> delete_(quote_tag)
      {:ok, %QuoteTag{}}

      iex> delete_(quote_tag)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%QuoteTag{} = quote_tag) do
    Repo.delete(quote_tag)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking quote_tag changes.

  ## Examples

      iex> change_(quote_tag)
      %Ecto.Changeset{source: %QuoteTag{}}

  """
  def change_(%QuoteTag{} = quote_tag, attrs \\ %{}) do
    QuoteTag.changeset(quote_tag, attrs)
  end
end
