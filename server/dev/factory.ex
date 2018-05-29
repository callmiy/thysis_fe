defmodule Gas.Factory do
  use ExMachina.Ecto, repo: Gas.Repo

  alias Gas.SourceType
  alias Gas.Source
  alias Gas.Quote
  alias Gas.Tag

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]

  def source_type_factory do
    %SourceType{
      name: Faker.Name.name()
    }
  end

  def source_factory do
    year = random_date().year

    citation =
      [
        Faker.String.base64(),
        year,
        Faker.String.base64(3)
      ]
      |> Enum.join()

    %Source{
      citation: citation,
      year: year,
      source_type: build(:source_type)
    }
  end

  def quote_factory do
    page_start = Faker.random_between(1, 100)

    page_end =
      Enum.random([
        page_start + Faker.random_between(2, 100),
        nil
      ])

    %Quote{
      date: random_date(),
      page_start: page_start,
      page_end: page_end,
      text: Faker.String.base64(Faker.random_between(50, 200)),
      source: build(:source)
    }
  end

  def tag_factory do
    %Tag{
      text: Faker.String.base64(Faker.random_between(5, 15))
    }
  end

  def map(built), do: Map.from_struct(built)

  defp random_date, do: Faker.Date.between(@start_date, @end_date)
end
