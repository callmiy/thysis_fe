defmodule Gas.SourceApi do
  @moduledoc """
  The Sources context.
  """

  import Ecto.Query, warn: false
  alias Ecto.Multi
  alias Gas.Repo
  alias Gas.Source
  alias Gas.SourceAuthor
  alias Gas.Author

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
  def get(id), do: Repo.get(Source, id)

  @doc """
  Creates a source.

  ## Examples

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_maps: [
            %{name: "author 1"}, %{name: "author 2"}
          ]
        })
      {:ok, %{source: %Source{}, author_maps: {2, [%Author{}, %Author{}]} }}

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_ids: [1, 2, 3, 4]
        })
      {:ok, %{source: %Source{}, author_ids: {4, nil}}}

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_ids: [1, 2, 3, 4],
          author_maps: [
            %{name: "author 1"}, %{name: "author 2"}
          ]
        })
      {:ok, %{
        source: %Source{},
        author_ids: {4, nil},
        author_maps: [%Author{}, %Author{}]
      }}

      iex> create_(%{
          source: %{topic: "topic", ..}
      })
      {:error, :no_authors}

      iex> create_(%{
          source: %{topic: nil}
      })
      {:error, field_operations_names, changeset, successful_operations}

  """
  @spec create_(
          %{
            source: Map.t(),
            author_maps: [Map.t()] | nil,
            author_ids: [Integer.t() | String.t()] | nil
          }
          | %{
              topic: String.t() | nil,
              author_maps: [Map.t()] | nil,
              author_ids: [Integer.t() | String.t()] | nil
            }
          | %{}
        ) ::
          {:ok,
           %{
             source: %Source{},
             author_ids: {Integer.t(), nil} | nil,
             author_maps: {Integer.t(), [%Author{id: Integer.t()}]} | nil
           }}
          | {:error, :no_authors}
          | {:error, Multi.name(), any(), %{optional(Multi.name()) => any()}}
  def create_(%{topic: _} = attrs) do
    authors = Map.take(attrs, [:author_ids, :author_maps])

    %{source: Map.delete(attrs, [:author_ids, :author_maps])}
    |> Map.merge(authors)
    |> create_
  end

  def create_(%{source: _} = attrs) do
    author_maps = Map.get(attrs, :author_maps)
    author_ids = Map.get(attrs, :author_ids)

    create_(attrs, author_maps, author_ids)
  end

  def create_(%{} = attrs), do: create_(Map.put(attrs, :topic, nil))

  def create_(_, nil, nil), do: {:error, :no_authors}

  def create_(source, author_maps, author_ids) do
    {source, rest} = Map.pop(source, :source)

    Multi.new()
    |> Multi.insert(
      :source,
      change_(%Source{}, Map.merge(rest, source))
    )
    |> create_authors_multi(:author_maps, author_maps)
    |> create_authors_multi(:author_ids, author_ids)
    |> Repo.transaction()
  end

  def create_authors_multi(transaction, _, nil),
    do: Multi.merge(transaction, fn _ -> Multi.new() end)

  def create_authors_multi(transaction, :author_ids, author_ids) when is_list(author_ids) do
    now = Timex.now()

    Multi.merge(transaction, fn %{source: %Source{id: id}} ->
      source_authors =
        Enum.map(
          author_ids,
          &[
            author_id: String.to_integer("#{&1}"),
            source_id: id,
            inserted_at: now,
            updated_at: now
          ]
        )

      Multi.new()
      |> Multi.insert_all(
        :author_ids,
        SourceAuthor,
        source_authors
      )
    end)
  end

  def create_authors_multi(transaction, :author_maps, author_maps) when is_list(author_maps) do
    now = Timex.now()

    Multi.merge(transaction, fn %{source: %Source{id: id}} ->
      Multi.new()
      |> Multi.insert_all(
        :author_maps,
        Author,
        Enum.map(author_maps, &Map.merge(&1, %{inserted_at: now, updated_at: now})),
        returning: [:id]
      )
      |> Multi.merge(fn %{author_maps: {_num_inserts, authors}} ->
        source_authors =
          Enum.map(
            authors,
            &[
              author_id: String.to_integer("#{&1.id}"),
              source_id: id,
              inserted_at: now,
              updated_at: now
            ]
          )

        Multi.new()
        |> Multi.insert_all(
          :source_authors,
          SourceAuthor,
          source_authors
        )
      end)
    end)
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
    source = Repo.preload(source, [:sources_authors])
    Enum.each(source.sources_authors, &Repo.delete(&1))
    Repo.delete(source)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking source changes.

  ## Examples

      iex> change_(source)
      %Ecto.Changeset{source: %Source{}}

  """
  def change_(%Source{} = source, attrs \\ %{}) do
    Source.changeset(source, attrs)
  end
end
