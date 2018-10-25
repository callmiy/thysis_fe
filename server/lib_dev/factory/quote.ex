defmodule Thises.Factory.Quote do
  use Thises.Factory, simple_attrs: :issue

  alias Thises.Factory
  alias Thises.QuoteApi

  def insert(attrs) do
    {:ok, q} =
      attrs
      |> params()
      |> QuoteApi.create_()

    q
  end

  def params(attrs) do
    defaults()
    |> Map.merge(attrs)
    |> page_end()
  end

  defp defaults,
    do: %{
      date: Factory.random_date(),
      page_start: Enum.random([nil, Faker.random_between(1, 100)]),
      text: Faker.String.base64(Faker.random_between(50, 200)),
      volume: Enum.random([Factory.random_string_int(), nil]),
      issue: Enum.random([Factory.random_string_int(), nil])
    }

  defp page_end(%{page_end: _} = attrs), do: attrs

  defp page_end(%{page_start: page_start} = attrs) do
    page_end =
      if page_start do
        case Enum.random([nil, 1]) do
          nil -> nil
          _ -> page_start + Faker.random_between(2, 100)
        end
      else
        nil
      end

    Map.put(attrs, :page_end, page_end)
  end
end
