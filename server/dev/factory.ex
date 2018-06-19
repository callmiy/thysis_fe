defmodule Gas.Factory do
  use ExMachina.Ecto, repo: Gas.Repo

  alias Gas.SourceType
  alias Gas.Quote
  alias Gas.Tag
  alias Gas.QuoteTag
  alias Gas.Author
  alias Gas.Factory.Source, as: SourceFactory

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]

  def source_type_factory do
    %SourceType{
      name: Faker.Name.name()
    }
  end

  def quote_factory do
    page_start =
      Enum.random([
        Faker.random_between(1, 100),
        nil
      ])

    page_end =
      if page_start do
        Enum.random([
          page_start + Faker.random_between(2, 100),
          nil
        ])
      else
        nil
      end

    %Quote{
      date: random_date(),
      page_start: page_start,
      page_end: page_end,
      text: Faker.String.base64(Faker.random_between(50, 200)),
      volume: Enum.random([get_random_string_integer(), nil]),
      issue: Enum.random([get_random_string_integer(), nil]),
      extras: Enum.random([Faker.String.base64(), nil]),
      source: SourceFactory.build(:source)
    }
  end

  def tag_factory do
    %Tag{
      text: Faker.String.base64(Faker.random_between(5, 15))
    }
  end

  def quote_tag_factory do
    %QuoteTag{
      quote: build(:quote),
      tag: build(:tag)
    }
  end

  def author_factory do
    %Author{
      name: Faker.Name.name()
    }
  end

  def map(built), do: Map.from_struct(built)

  defp random_date, do: Faker.Date.between(@start_date, @end_date)

  defp get_random_string_integer, do: Integer.to_string(Faker.random_between(2, 100))
end
