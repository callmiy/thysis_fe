defmodule Thises.Factory.Project do
  alias Thises.Accounts.User
  alias Thises.Factory.Registration, as: RegFactory
  alias Thises.Projects

  def insert_list(how_many, attrs \\ %{}) when how_many > 0,
    do:
      1..how_many
      |> Enum.map(fn _ -> insert(attrs) end)

  def insert(attrs \\ %{})

  def insert(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> insert()

  def insert(attrs) do
    {:ok, project} =
      attrs
      |> params_with_user()
      |> Projects.create_()

    project
  end

  def params(attrs \\ %{})

  def params(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> params()

  def params(attrs) do
    attrs
    |> title()
  end

  def params_with_user(attrs \\ %{}),
    do:
      attrs
      |> params()
      |> user()

  def stringify(%{} = attrs),
    do:
      attrs
      |> Map.delete(:user)
      |> Enum.map(fn
        {:user_id, id} -> {"userId", id}
        {k, v} -> {Atom.to_string(k), v}
      end)
      |> Enum.into(%{})

  defp title(%{title: _} = attrs), do: attrs

  defp title(attrs),
    do: Map.put(attrs, :title, 3..12 |> Enum.random() |> Faker.String.base64())

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
