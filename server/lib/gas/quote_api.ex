defmodule Gas.QuoteApi do
  @moduledoc """
  The Quotes context.
  """

  import Ecto.Query, warn: false
  alias Gas.Repo

  alias Gas.Quote

  @doc """
  Returns the list of quotes.

  ## Examples

      iex> list()
      [%Quote{}, ...]

  """
  def list do
    Repo.all(Quote)
  end

  @doc """
  Gets a single quote.

  Raises `Ecto.NoResultsError` if the Quote does not exist.

  ## Examples

      iex> get!(123)
      %Quote{}

      iex> get!(456)
      ** (Ecto.NoResultsError)

  """
  def get!(id), do: Repo.get!(Quote, id)

  @doc """
  Creates a quote.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Quote{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %Quote{}
    |> Quote.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a quote.

  ## Examples

      iex> update_(quote, %{field: new_value})
      {:ok, %Quote{}}

      iex> update_(quote, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%Quote{} = quote, attrs) do
    quote
    |> Quote.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Quote.

  ## Examples

      iex> delete_(quote)
      {:ok, %Quote{}}

      iex> delete_(quote)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Quote{} = quote) do
    Repo.delete(quote)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking quote changes.

  ## Examples

      iex> change_(quote)
      %Ecto.Changeset{source: %Quote{}}

  """
  def change_(%Quote{} = quote) do
    Quote.changeset(quote, %{})
  end
end
