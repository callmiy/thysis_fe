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

  def list(:authors) do
    Source
    # |> join(:inner, [s], a in assoc(s, :authors))
    # |> preload([s, a], authors: a)
    |> preload([s], [:authors])
    |> Repo.all()
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

  def get(id) do
    case Source
         |> where([s], s.id == ^id)
         |> join(:inner, [s], a in assoc(s, :authors))
         |> preload([s, a], authors: a)
         |> Repo.one() do
      nil ->
        case Repo.get(Source, id) do
          nil ->
            nil

          source ->
            Repo.preload(source, [:authors])
        end

      source ->
        source
    end
  end

  @doc """
  Creates a source.

  ## Examples

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_attrs: [
            %{name: "author 1"}, %{name: "author 2"}
          ]
        })
      {:ok, %{source: %Source{}, author_attrs: {2, [%Author{}, %Author{}]} }}

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_ids: [1, 2, 3, 4]
        })
      {:ok, %{source: %Source{}, author_ids: {4, nil}}}

      iex> create_(%{
          source: %{topic: "topic", ..},
          author_ids: [1, 2, 3, 4],
          author_attrs: [
            %{name: "author 1"}, %{name: "author 2"}
          ]
        })
      {:ok, %{
        source: %Source{},
        author_ids: {4, nil},
        author_attrs: [%Author{}, %Author{}]
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
            author_attrs: [Map.t()] | nil,
            author_ids: [Integer.t() | String.t()] | nil
          }
          | %{}
        ) ::
          {:ok,
           %{
             source: %Source{authors: [%Author{}]},
             source_type: %SourceType{} | nil,
             soure_author_ids: {Integer.t(), nil} | nil,
             soure_author_params: {Integer.t(), nil} | nil,
             author_attrs: {Integer.t(), [%Author{id: Integer.t()}]} | nil
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
    {source_multi, changes} = create_source_multi(source_type_multi, attrs)

    with {:ok, result} <-
           source_multi
           |> create_authors_multi(:author_attrs, changes)
           |> create_authors_multi(:author_ids, changes)
           |> Repo.transaction() do
      result = create_source_result(result)
      {:ok, result}
    end
  end

  defp create_source_multi(source_type_multi, %Source{} = source) do
    create_source_multi(source_type_multi, Map.from_struct(source))
  end

  defp create_source_multi(nil, source) do
    changes = change_(%Source{}, source)

    multi =
      Multi.new()
      |> Multi.insert(:source, changes)

    {multi, changes}
  end

  defp create_source_multi(source_type_multi, source) do
    # we don't have source_type_id yet, so we fake 0 so that changeset passes
    # for source_type_id
    changes = change_(%Source{}, Map.put(source, :source_type_id, 0))

    multi =
      Multi.merge(source_type_multi, fn %{source_type: %SourceType{id: id}} ->
        Multi.new()
        |> Multi.insert(
          :source,
          change_(%Source{}, Map.put(source, :source_type_id, id))
        )
      end)

    {multi, changes}
  end

  defp create_authors_multi(transaction, :author_ids, %Ecto.Changeset{
         changes: %{author_ids: author_ids}
       })
       when is_list(author_ids) do
    now = Timex.now()

    Multi.merge(transaction, fn %{source: %Source{id: id}} = _result ->
      source_authors =
        Enum.map(
          author_ids,
          &[
            author_id: &1.id,
            source_id: id,
            inserted_at: now,
            updated_at: now
          ]
        )

      Multi.new()
      |> Multi.insert_all(
        :source_author_ids,
        SourceAuthor,
        source_authors
      )
    end)
  end

  defp create_authors_multi(transaction, :author_attrs, %Ecto.Changeset{
         changes: %{author_attrs: author_attrs}
       })
       when is_list(author_attrs) do
    now = Timex.now()

    Multi.merge(transaction, fn %{source: %Source{id: id}} ->
      Multi.new()
      |> Multi.insert_all(
        :author_attrs,
        Author,
        Enum.map(author_attrs, &Map.merge(&1, %{inserted_at: now, updated_at: now})),
        returning: true
      )
      |> Multi.merge(fn %{author_attrs: {_num_inserts, authors}} ->
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
          :source_author_params,
          SourceAuthor,
          source_authors
        )
      end)
    end)
  end

  defp create_authors_multi(transaction, _, _),
    do: Multi.merge(transaction, fn _ -> Multi.new() end)

  defp create_source_result(%{source: %{author_ids: nil}, author_attrs: {_, maps}} = result)
       when is_list(maps),
       do: create_source_result(result, maps)

  defp create_source_result(%{source: %{author_ids: ids}, author_attrs: {_, maps}} = result)
       when is_list(ids) and is_list(maps) do
    create_source_result(result, Enum.concat(ids, maps))
  end

  defp create_source_result(%{source: %{author_ids: ids}} = result)
       when is_list(ids),
       do: create_source_result(result, ids)

  defp create_source_result(result), do: create_source_result(result, [])

  defp create_source_result(%{source: %{authors: source_authors} = source} = result, authors)
       when is_list(authors) do
    authors =
      case source_authors do
        source_authors when is_list(source_authors) ->
          Enum.concat(source_authors, authors)

        _ ->
          authors
      end

    %{
      result
      | source: %{
          source
          | authors: authors
        }
    }
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
    changes = Source.changeset(source, attrs)

    with {:ok, result} <-
           Multi.new()
           |> Multi.update(:source, changes)
           |> create_authors_multi(:author_attrs, changes)
           |> create_authors_multi(:author_ids, changes)
           |> Repo.transaction() do
      result = create_source_result(result)
      {:ok, result}
    end
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
    source = Repo.preload(source, [:source_authors])
    Enum.each(source.source_authors, &Repo.delete(&1))
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

  def author_required_error_string, do: "author ids or map required"

  def invalid_ids_error_string(ids) when is_list(ids),
    do: ~s[Invalid author IDs: #{Enum.join(ids, ", ")}]
end
