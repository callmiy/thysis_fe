defmodule Thysis.Factory.Tag do
  use Thysis.Factory

  alias Thysis.TagApi
  alias Thysis.Factory
  alias Thysis.Tag

  @simple_attrs [:text, :question]

  def insert(attrs) do
    {:ok, tag} =
      attrs
      |> params()
      |> TagApi.create_()

    tag
  end

  def params(attrs) do
    defaults()
    |> Map.merge(attrs)
  end

  defp defaults,
    do: %{
      text: Faker.String.base64(Faker.random_between(5, 15)),
      question:
        Enum.random([
          nil,
          Faker.String.base64(Faker.random_between(5, 15))
        ])
    }

  def stringify(%Tag{} = attrs),
    do:
      attrs
      |> Map.from_struct()
      |> stringify()

  def stringify(%{} = attrs) do
    attrs
    |> Factory.reject_attrs()
    |> Enum.map(fn
      {k, v} when k in @simple_attrs ->
        {Factory.to_camel_key(k), v}

      _ ->
        nil
    end)
    |> Enum.into(%{})
  end
end
