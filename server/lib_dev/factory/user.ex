defmodule Thises.Factory.User do
  @doc "params"
  def params(attrs \\ %{})

  def params(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> params()

  def params(%{} = attrs) do
    attrs
    |> name()
    |> email()
    |> rev()
  end

  def stringify(%{} = params),
    do:
      params
      |> Enum.map(fn {k, v} -> {Atom.to_string(k), v} end)
      |> Enum.into(%{})

  defp name(%{name: _val} = params), do: params
  defp name(params), do: Map.put(params, :name, Faker.Name.first_name())

  defp email(%{email: _val} = params), do: params
  defp email(params), do: Map.put(params, :email, Faker.Internet.email())

  defp rev(%{_rev: _val} = params), do: params
  defp rev(params), do: Map.put(params, :_rev, Faker.String.base64())
end
