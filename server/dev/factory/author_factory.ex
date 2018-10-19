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
    do: %{
      "firstName" => attrs.first_name,
      "lastName" => attrs.last_name,
      "middleName" => attrs.middle_name
    }

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
