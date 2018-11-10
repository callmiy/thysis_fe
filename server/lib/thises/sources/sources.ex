defmodule Thysis.Sources do
  @moduledoc """
  The Sources context.
  """

  import Ecto.Query, warn: false
  alias Ecto.Multi
  alias Thysis.Repo
  alias Thysis.Sources.Source
  alias Thysis.SourceAuthor
  alias Thysis.Author
  alias Thysis.SourceType
  alias Thysis.SourceTypeApi
  alias Thysis.SourceAuthorApi

  @doc """
  Returns the list of sources.

  ## Examples

      iex> list()
      [%Source{}, ...]

  """
  def list do
    Repo.all(Source)
  end

  def list(attrs) do
    attrs
    |> Enum.reduce(Source, &where_by/2)
    |> Repo.all()
  end

  defp where_by({:project_id, id}, query),
    do: where(query, [s], s.project_id == ^id)

  defp where_by({:user_id, id}, query),
    do: where(query, [s], s.user_id == ^id)

  @doc """
  Gets a single source.

  Raises `Ecto.NoResultsError` if the Source does not exist.

  ## Examples

      iex> get(123)
      %Source{}

      iex> get(456)
      ** nil

  """
  def get(%{id: source_id, user_id: user_id}) do
    Source
    |> where([s], s.id == ^source_id)
    |> where([s], s.user_id == ^user_id)
    |> Repo.one()
  end

  def get(id), do: Repo.get(Source, id)

  @spec create_(
          %{
            project_id: binary() | integer(),
            topic: String.t() | nil,
            source_type_id: Integer.t() | String.t() | nil,
            author_attrs: [Map.t()] | nil,
            author_ids: [Integer.t() | String.t()] | nil
          }
          | map()
        ) ::
          {:ok,
           %{
             source: %Source{authors: [%Author{}]},
             source_type: %SourceType{} | nil,
             source_author_ids: {Integer.t(), nil} | nil,
             source_author_params: {Integer.t(), nil} | nil,
             author_attrs: {Integer.t(), [%Author{id: Integer.t()}]} | nil
           }}
          | {:error, Multi.name(), any(), %{optional(Multi.name()) => any()}}
  def create_(%{source_type_id: nil, source_type: %{} = source_type} = attrs) do
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
    attrs =
      attrs
      |> string_valued_attrs_to_integer()
      |> augment_author_attrs()

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

  # Ecto Multi insert needs associated IDs to be integer not strings
  defp string_valued_attrs_to_integer(attrs) do
    integer_attrs =
      attrs
      |> Map.take([:project_id, :user_id])
      |> Enum.map(fn
        {k, v} when is_binary(v) ->
          {k, String.to_integer(v)}

        other ->
          other
      end)
      |> Enum.into(%{})

    Map.merge(attrs, integer_attrs)
  end

  # We will assume we are creating authors for source user and project
  defp augment_author_attrs(
         %{author_attrs: data, project_id: project_id, user_id: user_id} = attrs
       )
       when is_list(data) do
    other_fields = %{
      project_id: project_id,
      user_id: user_id
    }

    %{
      attrs
      | author_attrs: augment_author_attrs(data, other_fields)
    }
  end

  defp augment_author_attrs(%{author_attrs: data} = attrs) when is_list(data) do
    %{
      attrs
      | author_attrs: augment_author_attrs(data, %{})
    }
  end

  defp augment_author_attrs(attrs), do: attrs

  defp augment_author_attrs(author_attrs, %{} = to_merge) when is_list(author_attrs) do
    author_attrs
    |> Enum.map(fn author ->
      author
      |> Enum.map(fn
        {k, v} when k in [:project_id, :user_id] and is_binary(v) ->
          {k, String.to_integer(v)}

        other ->
          other
      end)
      |> Enum.into(%{})
      |> Map.merge(to_merge)
    end)
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

  defp create_authors_multi(
         transaction,
         :author_attrs,
         %Ecto.Changeset{
           changes: %{author_attrs: author_attrs}
         }
       )
       when is_list(author_attrs) do
    now = Timex.now()

    other_fields = %{
      inserted_at: now,
      updated_at: now
    }

    Multi.merge(transaction, fn %{source: %Source{id: source_id}} ->
      Multi.new()
      |> Multi.insert_all(
        :author_attrs,
        Author,
        Enum.map(author_attrs, &Map.merge(&1, other_fields)),
        returning: true
      )
      |> Multi.merge(fn %{author_attrs: {_num_inserts, authors}} ->
        source_authors =
          Enum.map(
            authors,
            &[
              author_id: String.to_integer("#{&1.id}"),
              source_id: source_id,
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
    attrs =
      attrs
      |> string_valued_attrs_to_integer()
      |> augment_author_attrs()

    changes = Source.changeset(source, attrs)

    with {:ok, result} <-
           Multi.new()
           |> delete_authors_multi(attrs)
           |> Multi.update(:source, changes)
           |> create_authors_multi(:author_attrs, changes)
           |> create_authors_multi(:author_ids, changes)
           |> Repo.transaction() do
      result = create_source_result(result) |> delete_authors()

      {:ok, result}
    end
  end

  defp delete_authors_multi(transaction, %{deleted_authors: ids}) when is_list(ids) do
    Multi.run(transaction, :delete_authors, fn _n ->
      {:ok, SourceAuthorApi.delete_(ids)}
    end)
  end

  defp delete_authors_multi(transaction, _) do
    Multi.run(transaction, :delete_authors, fn _ -> {:ok, []} end)
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
  Returns a string that can be used to display the source (sort of to_string).
  The fields that are important are joined together with " | ". Fields that are
  `nil` are ignored
  """
  @spec display(source :: %Source{}) :: String.t()
  def display(%Source{} = source) do
    source
    |> Map.take([:authors, :topic, :publication, :year, :url])
    |> map_reduce()
    |> Enum.join(" | ")
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking source changes.

  ## Examples

      iex> change_(source, attrs)
      %Ecto.Changeset{source: %Source{}}

  """
  def change_(source, attrs \\ %{})

  def change_(%Source{} = source, %Source{} = attrs) do
    Source.changeset(source, Map.from_struct(attrs))
  end

  def change_(%Source{} = source, attrs), do: Source.changeset(source, attrs)

  def author_required_error_string, do: "author ids or map required"

  def invalid_ids_error_string(ids) when is_list(ids),
    do: ~s[Invalid author IDs: #{Enum.join(ids, ", ")}]

  # ABSINTHE DATALOADER
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end

  # END ABSINTHE DATALOADER

  defp delete_authors(%{source: %{authors: authors} = source, delete_authors: ids} = record)
       when is_list(authors) and is_list(ids) do
    %{
      record
      | source: %{
          source
          | authors: Enum.filter(authors, &(!Enum.member?(ids, &1.id)))
        }
    }
  end

  defp delete_authors(record), do: record

  defp map_reduce(list) when is_list(list), do: Enum.map(list, &map_reduce/1)

  defp map_reduce(%{} = map) do
    Enum.reduce(map, [], fn
      {:authors, authors}, acc ->
        authors =
          Enum.map(authors, fn author ->
            initials =
              [author.first_name, author.middle_name]
              |> Enum.reject(&(&1 == nil))
              |> Enum.map(fn s ->
                s
                |> String.split(" ")
                |> Enum.map(fn name ->
                  name |> String.first() |> String.upcase()
                end)
                |> Enum.join("")
              end)
              |> Enum.join("")

            case initials do
              "" -> author.last_name
              initials -> "#{author.last_name} #{initials}"
            end
          end)
          |> Enum.join(", ")
          |> Kernel.<>(".")

        [authors | acc]

      {_, nil}, acc ->
        acc

      {_, val}, acc when is_list(val) or is_map(val) ->
        Enum.concat(acc, map_reduce(val))

      {_, v}, acc ->
        [v | acc]
    end)
    |> Enum.reverse()
  end

  defp map_reduce(val), do: val
end
