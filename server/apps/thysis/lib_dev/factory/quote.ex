defmodule Thysis.Factory.Quote do
  use Thysis.Factory

  alias Thysis.Factory
  alias Thysis.QuoteApi
  alias Thysis.Quote
  alias Thysis.Factory.Tag, as: TagFactory

  @simple_attrs [
    :page_start,
    :page_end,
    :text,
    :volume,
    :issue,
    :source_id,
    :extras
  ]

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
    |> tags()
  end

  defp defaults,
    do: %{
      date: Factory.random_date(),
      page_start: Enum.random([nil, Faker.random_between(1, 100)]),
      text: Faker.String.base64(Faker.random_between(50, 200)),
      volume: Enum.random([Factory.random_string_int(), nil]),
      issue: Enum.random([Factory.random_string_int(), nil]),
      extras: Enum.random([nil, Faker.String.base64(5)])
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

  defp tags(%{tags: _} = attrs), do: attrs

  defp tags(attrs) do
    Map.put(
      attrs,
      :tags,
      Enum.random(1..5)
      |> TagFactory.insert_list()
      |> Enum.map(& &1.id)
    )
  end

  def stringify(%Quote{} = attrs) do
    attrs
    |> Map.from_struct()
    |> stringify()
  end

  def stringify(%{} = attrs) do
    attrs
    |> Factory.reject_attrs()
    |> Enum.map(fn
      {k, v} when k in @simple_attrs ->
        {Factory.to_camel_key(k), v}

      {k, %Date{} = v} ->
        {Factory.to_camel_key(k), Date.to_iso8601(v)}

      {:tags, v} ->
        {"tags", v}

      _ ->
        nil
    end)
    |> Enum.reject(&(&1 == nil))
    |> Enum.into(%{})
  end
end
