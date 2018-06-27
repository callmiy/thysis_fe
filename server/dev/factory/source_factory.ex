defmodule Gas.Factory.Source do
  use ExMachina

  alias Gas.Factory
  alias Gas.Source
  alias Gas.SourceApi
  alias ExMachina.Ecto, as: ExEcto

  @name __MODULE__

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]

  def source_factory do
    %Source{
      topic: Faker.String.base64(),
      year: Enum.random([Integer.to_string(random_date().year), nil]),
      publication: Enum.random([Faker.String.base64(), nil]),
      url: Enum.random([Faker.Internet.url(), nil]),
      source_type: Factory.build(:source_type)
    }
    |> handle_assoc()
  end

  def with_authors(attrs \\ %{})

  def with_authors(attrs) when is_list(attrs) do
    Map.new(attrs)
    |> with_authors()
  end

  def with_authors(%{} = attrs) do
    build(:source, attrs)
    |> Map.merge(make_authors_map(attrs))
  end

  def params_for(factory, attrs \\ %{})

  def params_for(factory, attrs) when is_list(attrs) do
    params_for(factory, Map.new(attrs))
  end

  def params_for(:with_authors, %{} = attrs),
    do:
      params(attrs)
      |> Map.merge(make_authors_map(attrs))

  def params_with_assocs(factory \\ nil, attrs \\ %{})

  def params_with_assocs(factory, attrs) when is_list(attrs) do
    params_with_assocs(factory, Map.new(attrs))
  end

  def params_with_assocs(:with_authors, %{} = attrs) do
    params_with_assocs(nil, attrs)
    |> Map.merge(make_authors_map(attrs))
  end

  def params_with_assocs(_any, %{} = attrs) do
    %{id: id} = Factory.insert(:source_type)

    params(attrs)
    |> Map.put(:source_type_id, id)
  end

  def params(attrs \\ %{}),
    do:
      ExEcto.params_for(
        @name,
        :source,
        attrs
      )

  def insert(attrs \\ %{})
  def insert(attrs) when is_list(attrs), do: Map.new(attrs) |> insert()

  def insert(attrs) do
    {:ok, %{source: %Source{} = source}} =
      params_with_assocs(:with_authors, attrs)
      |> SourceApi.create_()

    source
  end

  def insert_list(how_many \\ 2, attrs \\ %{})

  def insert_list(how_many, attrs) when is_list(attrs) do
    attrs = Map.new(attrs)
    insert_list(how_many, attrs)
  end

  def insert_list(how_many, attrs) do
    Enum.map(1..how_many, fn _ -> insert(attrs) end)
  end

  defp random_date, do: Faker.Date.between(@start_date, @end_date)

  defp make_author_attrs(how_many \\ 5) when is_integer(how_many) do
    1..Faker.random_between(1, how_many)
    |> Enum.map(fn _ -> Factory.params_for(:author) end)
  end

  defp make_author_ids(how_many \\ 5) when is_integer(how_many) do
    Factory.insert_list(Faker.random_between(1, how_many), :author)
    |> Enum.map(& &1.id)
  end

  defp make_authors_map(%{} = attrs) do
    case {Map.has_key?(attrs, :author_ids), Map.has_key?(attrs, :author_attrs)} do
      {false, false} ->
        make_authors_map(2)

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
        %{}
    end
  end

  defp make_authors_map(2) do
    {author_attrs, author_ids} =
      case Enum.random([:author_attrs, :author_ids, 2]) do
        :author_attrs ->
          {make_author_attrs(), nil}

        :author_ids ->
          {nil, make_author_ids()}

        2 ->
          {make_author_attrs(), make_author_ids()}
      end

    %{
      author_ids: author_ids,
      author_attrs: author_attrs
    }
  end

  defp handle_assoc(%{source_type_id: nil, source_type: %{id: id}} = record) do
    %{
      record
      | source_type_id: id
    }
  end

  defp handle_assoc(record), do: record
end
