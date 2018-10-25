defmodule Thises.Factory.Tag do
  use Thises.Factory

  alias Thises.TagApi

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
end
