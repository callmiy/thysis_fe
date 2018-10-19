defmodule Gas.Factory.Source do
  @dialyzer {:no_return, [insert: 1, insert: 0]}

  alias Gas.Factory
  alias Gas.Factory.Author, as: AuthorFactory
  alias Gas.SourceApi
  alias Gas.Source
  alias Gas.SourceType

  def insert_list(how_many, attrs \\ %{}),
    do:
      1..how_many
      |> Enum.map(fn _ -> insert(attrs) end)

  def insert(attrs \\ %{})

  def insert(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> insert

  def insert(attrs) do
    {:ok, data} =
      attrs
      |> params()
      |> SourceApi.create_()

    data.source
  end

  def params(attrs \\ %{})

  def params(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> params

  def params(attrs) do
    attrs
    |> params_no_authors()
    |> Map.merge(authors(attrs))
  end

  def params_no_authors(attrs \\ %{})

  def params_no_authors(attrs) do
    %{
      topic: topic(attrs),
      year: year(attrs),
      publication: publication(attrs),
      url: url(attrs)
    }
    |> Map.merge(source_type_id(attrs))
  end

  def stringify(%Source{} = source),
    do:
      source
      |> Map.from_struct()
      |> stringify()

  def stringify(%{} = attrs),
    do:
      attrs
      |> Enum.map(fn
        {_, nil} ->
          nil

        {:source_type_id, id} ->
          {"sourceTypeId", Integer.to_string(id)}

        {:source_type, source_type} ->
          {"sourceType", source_type}

        {:author_ids, ids} ->
          {"authorIds", Enum.map(ids, &Integer.to_string/1)}

        {:author_attrs, attrs} ->
          {"authorAttrs", Enum.map(attrs, &AuthorFactory.stringify/1)}

        {k, v} when k in [:topic, :year, :publication, :url] ->
          {Atom.to_string(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})

  defp topic(%{topic: topic}), do: topic
  defp topic(_), do: Faker.String.base64()

  defp year(%{year: year}), do: year

  defp year(_),
    do: Enum.random([Integer.to_string(Factory.random_date().year), nil])

  defp publication(%{publication: publication}), do: publication
  defp publication(_), do: Enum.random([Faker.String.base64(), nil])

  defp url(%{url: url}), do: url
  defp url(_), do: Enum.random([Faker.Internet.url(), nil])

  defp source_type_id(%{source_type_id: id}) when is_binary(id) or is_integer(id),
    do: %{
      source_type_id: id
    }

  defp source_type_id(%{source_type: %SourceType{} = source_type}) do
    source_type_id(%{source_type: Map.from_struct(source_type)})
  end

  defp source_type_id(%{source_type: source_type}),
    do: %{
      source_type: source_type,
      source_type_id: Map.get(source_type, :id)
    }

  defp source_type_id(_),
    do: %{
      source_type: Factory.params_for(:source_type),
      source_type_id: nil
    }

  defp authors(%{} = attrs) do
    case {Map.has_key?(attrs, :author_ids), Map.has_key?(attrs, :author_attrs)} do
      {false, false} ->
        1..5
        |> Enum.random()
        |> authors_ids_maps()

      {true, false} ->
        %{
          author_ids: Map.get(attrs, :author_ids),
          author_attrs: make_author_attrs()
        }

      {false, true} ->
        %{
          author_ids: make_author_ids(),
          author_attrs: Map.get(attrs, :author_attrs)
        }

      _ ->
        attrs
    end
  end

  defp authors_ids_maps(how_many) do
    {author_attrs, author_ids} =
      case Enum.random([:author_attrs, :author_ids, how_many]) do
        :author_attrs ->
          {make_author_attrs(), nil}

        :author_ids ->
          {nil, make_author_ids()}

        ^how_many ->
          {make_author_attrs(how_many), make_author_ids(how_many)}
      end

    %{
      author_ids: author_ids,
      author_attrs: author_attrs
    }
  end

  defp make_author_attrs(how_many \\ 5) when is_integer(how_many) do
    1..Faker.random_between(1, how_many)
    |> Enum.map(fn _ -> AuthorFactory.params() end)
  end

  defp make_author_ids(how_many \\ 5) when is_integer(how_many) do
    Faker.random_between(1, how_many)
    |> AuthorFactory.insert_list()
    |> Enum.map(& &1.id)
  end
end
