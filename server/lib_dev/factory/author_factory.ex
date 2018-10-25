defmodule Thises.Factory.Author do
  use Thises.Factory

  alias Thises.AuthorApi, as: Api
  alias Thises.Factory

  @simple_attrs [:last_name, :first_name, :middle_name]

  def params(attrs) do
    %{
      first_name: first_name(attrs),
      last_name: last_name(attrs),
      middle_name: middle_name(attrs)
    }
  end

  def insert(attrs) do
    {:ok, author} =
      attrs
      |> params()
      |> Api.create_()

    author
  end

  def stringify(%{} = attrs),
    do:
      attrs
      |> Enum.map(fn
        {_, nil} ->
          nil

        {k, v} when k in @simple_attrs ->
          {Factory.to_camel_key(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})

  defp first_name(%{first_name: name}), do: name
  defp first_name(_), do: Enum.random([Faker.Name.first_name(), nil])
  defp last_name(%{last_name: name}), do: name
  defp last_name(_), do: Faker.Name.last_name()
  defp middle_name(%{middle_name: name}), do: name

  defp middle_name(_) do
    case Enum.random([
           nil,
           Faker.String.base64(Enum.random(1..5))
         ]) do
      nil -> nil
      name -> String.capitalize(name)
    end
  end
end
