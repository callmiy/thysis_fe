defmodule Thysis.Factory.Project do
  alias Thysis.Accounts.User
  alias Thysis.Factory.Registration, as: RegFactory
  alias Thysis.Projects
  alias Thysis.Projects.Project

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
      |> params_with_assoc()
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

  def params_with_assoc(attrs \\ %{}),
    do:
      attrs
      |> params()
      |> user()

  def stringify(%Project{} = project),
    do:
      project
      |> Map.from_struct()
      |> stringify()

  def stringify(%{} = attrs),
    do:
      attrs
      |> Map.delete(:user)
      |> Enum.map(fn
        {:user_id, id} ->
          {"userId", id}

        {k, v} when k in [:id, :title] ->
          {Atom.to_string(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
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
