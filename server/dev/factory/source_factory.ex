defmodule Gas.Factory.Source do
  use ExMachina
  use Gas.Factory.SourceStrategy

  alias Gas.Factory
  alias Gas.Source
  alias ExMachina.Ecto, as: ExEcto

  @name __MODULE__

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]

  def source_factory do
    {authors, author_ids} =
      case Enum.random([:authors, :author_ids, 2]) do
        :authors ->
          make_authors()

        :author_ids ->
          make_author_ids()

        2 ->
          {authors, nil} = make_authors()
          {nil, author_ids} = make_author_ids()

          {authors, author_ids}
      end

    %Source{
      topic: Faker.String.base64(),
      year: Enum.random([Integer.to_string(random_date().year), nil]),
      publication: Enum.random([Faker.String.base64(), nil]),
      url: Enum.random([Faker.Internet.url(), nil]),
      source_type: Factory.build(:source_type),
      author_ids: author_ids,
      author_maps: authors
    }
  end

  def params_for(:source, attrs \\ %{}), do: params(attrs)

  def params_with_assocs(:source, attrs \\ %{}) do
    %{id: id} = Factory.insert(:source_type)

    params(attrs)
    |> Map.put(:source_type_id, id)
  end

  defp params(attrs),
    do:
      ExEcto.params_for(
        @name,
        :source,
        attrs
      )

  defp random_date, do: Faker.Date.between(@start_date, @end_date)

  defp make_authors(how_many \\ 5) when is_integer(how_many) do
    authors =
      1..Faker.random_between(1, how_many)
      |> Enum.map(fn _ -> Factory.params_for(:author) end)

    {authors, nil}
  end

  defp make_author_ids(how_many \\ 5) when is_integer(how_many) do
    author_ids =
      Factory.insert_list(Faker.random_between(1, how_many), :author)
      |> Enum.map(& &1.id)

    {nil, author_ids}
  end
end
