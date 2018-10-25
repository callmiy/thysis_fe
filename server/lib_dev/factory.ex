defmodule Thises.Factory do
  use ExMachina.Ecto, repo: Thises.Repo

  @dialyzer {:no_return, [fields_for: 1] }

  alias Thises.SourceType
  alias Thises.Quote
  alias Thises.Tag
  alias Thises.QuoteTag
  alias Thises.Author
  alias Thises.Factory.Source, as: SourceFactory

  @start_date ~D[1998-01-01]
  @end_date ~D[2018-12-31]
  @nil_other [nil, 1]

  def source_type_factory do
    %SourceType{
      name: Faker.Name.name()
    }
  end

  def quote_factory do
    page_start =
      case Enum.random(@nil_other) do
        nil -> nil
        _ -> Faker.random_between(1, 100)
      end

    page_end =
      if page_start do
        case Enum.random(@nil_other) do
          nil -> nil
          _ -> page_start + Faker.random_between(2, 100)
        end
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
      source: SourceFactory.params()
    }
  end

  def tag_factory do
    question =
      case Enum.random(@nil_other) do
        nil -> nil
        1 -> Faker.String.base64(Faker.random_between(5, 15))
      end

    %Tag{
      text: Faker.String.base64(Faker.random_between(5, 15)),
      question: question
    }
  end

  def quote_tag_factory do
    %QuoteTag{
      quote: build(:quote),
      tag: build(:tag)
    }
  end

  def author_factory do
    middle_name =
      case Enum.random([
             nil,
             Faker.String.base64(Enum.random(1..5))
           ]) do
        nil -> nil
        name -> String.capitalize(name)
      end

    %Author{
      first_name: Enum.random([Faker.Name.first_name(), nil]),
      last_name: Faker.Name.last_name(),
      middle_name: middle_name
    }
  end

  def map(built), do: Map.from_struct(built)

  def random_date, do: Faker.Date.between(@start_date, @end_date)

  defp get_random_string_integer, do: Integer.to_string(Faker.random_between(2, 100))
end
