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
  alias Gas.SourceType
  alias Gas.SourceTypeApi

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
            topic: String.t() | nil,
            source_type_id: Integer.t() | String.t() | nil,
            author_maps: [Map.t()] | nil,
            author_ids: [Integer.t() | String.t()] | nil
          }
          | %{}
        ) ::
          {:ok,
           %{
             source: %Source{},
             source_type: %SourceType{} | nil,
             author_ids: {Integer.t(), nil} | nil,
             author_maps: {Integer.t(), [%Author{id: Integer.t()}]} | nil
           }}
          | {:error, Multi.name(), any(), %{optional(Multi.name()) => any()}}

  def create_(%{source_type_id: nil, source_type: %{id: nil} = source_type} = attrs) do
    source_type_multi =
      Multi.new()
      |> Multi.insert(
        :source_type,
        SourceTypeApi.change_(%SourceType{}, source_type)
      )

    create_source(source_type_multi, attrs)
  end

  def create_(%{source_type_id: _id} = attrs) do
    source_type_multi = nil
    create_source(source_type_multi, attrs)
  end

  def create_(attrs), do: create_source(nil, attrs)

  defp create_source(source_type_multi, attrs) do
    create_source_multi(source_type_multi, attrs)
    |> create_authors_multi(:author_maps, attrs)
    |> create_authors_multi(:author_ids, attrs)
    |> Repo.transaction()
  end

  defp create_source_multi(source_type_multi, %Source{} = source) do
    create_source_multi(source_type_multi, Map.from_struct(source))
  end

  defp create_source_multi(nil, source) do
    Multi.new()
    |> Multi.insert(
      :source,
      change_(%Source{}, source)
    )
  end

  defp create_source_multi(source_type_multi, source) do
    Multi.merge(source_type_multi, fn %{source_type: %SourceType{id: id}} ->
      Multi.new()
      |> Multi.insert(
        :source,
        change_(%Source{}, Map.put(source, :source_type_id, id))
      )
    end)
  end

  defp create_authors_multi(transaction, :author_ids, %{author_ids: author_ids})
       when is_list(author_ids) do
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

  defp create_authors_multi(transaction, :author_maps, %{author_maps: author_maps})
       when is_list(author_maps) do
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

  defp create_authors_multi(transaction, _, _),
    do: Multi.merge(transaction, fn _ -> Multi.new() end)

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
  def change_(source, attrs \\ %{})

  def change_(%Source{} = source, %Source{} = attrs) do
    Source.changeset(source, Map.from_struct(attrs))
  end

  def change_(%Source{} = source, attrs) do
    Source.changeset(source, attrs)
  end
end
