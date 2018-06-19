defmodule Gas.Factory.SourceStrategy do
  use ExMachina.Strategy, function_name: :create

  alias Gas.SourceApi
  alias Gas.Source

  def handle_create(record, _opts) do
    %Source{} = source = elem(SourceApi.create_(record), 1)

    %{
      source
      | author_ids: nil,
        author_maps: nil
    }
  end
end

defmodule Gas.Factory.Source do
  use ExMachina.Ecto, repo: Gas.Repo
  use Gas.Factory.SourceStrategy

  alias Gas.Factory
  alias Gas.Source

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]

  def source_factory do
    {authors, author_ids} =
      case Enum.random([:authors, :author_ids, 2]) do
        :authors ->
          authors =
            1..Faker.random_between(1, 5)
            |> Enum.map(fn _ -> Factory.params_for(:author) end)

          {authors, nil}

        :author_ids ->
          author_ids =
            Factory.insert_list(Faker.random_between(1, 5), :author)
            |> Enum.map(& &1.id)

          {nil, author_ids}

        2 ->
          authors =
            1..Faker.random_between(1, 5)
            |> Enum.map(fn _ -> Factory.params_for(:author) end)

          author_ids =
            Factory.insert_list(Faker.random_between(1, 5), :author)
            |> Enum.map(& &1.id)

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

  defp random_date, do: Faker.Date.between(@start_date, @end_date)
end
