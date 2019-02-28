defmodule Thysis.Factory.Registration do
  alias Thysis.Accounts

  @doc "insert"
  def insert(params \\ %{})

  def insert(params) do
    {:ok, registration} =
      params
      |> params()
      |> Accounts.register()

    registration
  end

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
    |> source()
    |> password()
    |> password_confirmation()
  end

  def stringify(%{} = params),
    do:
      params
      |> Enum.map(fn
        {:password_confirmation, v} -> {"passwordConfirmation", v}
        {k, v} -> {Atom.to_string(k), v}
      end)
      |> Enum.into(%{})

  defp name(%{name: _} = params), do: params
  defp name(params), do: Map.put(params, :name, Faker.Name.first_name())

  defp email(%{email: _} = attrs), do: attrs
  defp email(attrs), do: Map.put(attrs, :email, Faker.Internet.email())

  defp source(%{source: _} = attrs), do: attrs
  defp source(attrs), do: Map.put(attrs, :source, "password")

  defp password(%{password: _} = attrs), do: attrs
  defp password(attrs), do: Map.put(attrs, :password, Faker.String.base64())

  defp password_confirmation(%{password_confirmation: _} = attrs), do: attrs

  defp password_confirmation(%{password: password} = attrs),
    do: Map.put(attrs, :password_confirmation, password)
end
