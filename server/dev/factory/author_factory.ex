defmodule Gas.Factory.Author do
  alias Gas.AuthorApi, as: Api

  def params(attrs \\ %{})

  def params(attrs) when is_list(attrs), do: Map.new(attrs)

  def params(attrs) do
    %{
      first_name: first_name(attrs),
      last_name: last_name(attrs),
      middle_name: middle_name(attrs)
    }
  end

  def params_list(how_many, attrs \\ %{}),
    do: Enum.map(1..how_many, fn _ -> params(attrs) end)

  def insert_list(how_many),
    do: Enum.map(1..how_many, fn _ -> insert() end)

  def insert(attrs \\ %{})
  def insert(attrs) when is_list(attrs), do: Map.new(attrs)

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
        {_, nil} -> nil
        {:last_name, v} -> {"lastName", v}
        {:first_name, v} -> {"firstName", v}
        {:middle_name, v} -> {"middleName", v}
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
