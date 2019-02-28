defmodule Thysis.Factory.SourceType do
  use Thysis.Factory

  alias Thysis.Accounts.User
  alias Thysis.Factory.Registration, as: RegFactory
  alias Thysis.SourceTypeApi
  alias Thysis.Factory
  alias Thysis.Factory.User, as: UserFactory

  @simple_attrs [:name, :user_id]

  def insert(attrs) do
    {:ok, source_type} =
      attrs
      |> params_with_assoc()
      |> SourceTypeApi.create_()

    source_type
  end

  def params(attrs) do
    attrs
    |> name()
  end

  def params_with_assoc(attrs \\ %{}),
    do:
      attrs
      |> params()
      |> user()

  def stringify(%{} = attrs),
    do:
      attrs
      |> Factory.reject_attrs()
      |> Enum.map(fn
        {:user, v} ->
          {"user", UserFactory.stringify(v)}

        {k, v} when k in @simple_attrs ->
          {Factory.to_camel_key(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})

  defp name(%{name: _} = attrs), do: attrs

  defp name(attrs),
    do: Map.put(attrs, :name, 3..12 |> Enum.random() |> Faker.String.base64())

  defp user(%{user_id: _} = attrs), do: attrs

  defp user(%{user: %User{} = user} = attrs),
    do: Map.put(attrs, :user_id, user.id)

  defp user(attrs) do
    user = RegFactory.insert()

    Map.merge(attrs, %{
      user_id: user.id,
      user: user
    })
  end
end
