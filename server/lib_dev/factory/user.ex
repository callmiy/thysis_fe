defmodule Thysis.Factory.User do
  use Thysis.Factory

  alias Thysis.Factory

  @simple_attrs [:name, :email, :_rev]

  @doc false
  def insert(_), do: nil

  def params(%{} = attrs) do
    attrs
    |> name()
    |> email()
    |> rev()
  end

  def stringify(%{} = params),
    do:
      params
      |> Factory.reject_attrs()
      |> Enum.map(fn
        {k, v} when k in @simple_attrs ->
          {Factory.to_camel_key(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})

  defp name(%{name: _val} = params), do: params
  defp name(params), do: Map.put(params, :name, Faker.Name.first_name())

  defp email(%{email: _val} = params), do: params
  defp email(params), do: Map.put(params, :email, Faker.Internet.email())

  defp rev(%{_rev: _val} = params), do: params
  defp rev(params), do: Map.put(params, :_rev, Faker.String.base64())
end
