defmodule Thysis.Factory.Author do
  use Thysis.Factory

  alias Thysis.AuthorApi, as: Api
  alias Thysis.Factory
  alias Thysis.Author
  alias Thysis.Factory.Registration, as: RegFactory
  alias Thysis.Factory.Project, as: ProjectFactory

  @simple_attrs [
    :last_name,
    :first_name,
    :middle_name,
    :project_id,
    :user_id,
    :id
  ]

  def insert(attrs) do
    {:ok, author} =
      attrs
      |> params()
      |> Api.create_()

    author
  end

  def insert_assoc(attrs \\ %{}) do
    attrs
    |> params_assoc()
    |> insert()
  end

  def params(attrs) do
    defaults()
    |> Map.merge(attrs)
  end

  def params_assoc(attrs \\ %{}) do
    {_, assoc_ids} = assoc()

    attrs
    |> params()
    |> Map.merge(assoc_ids)
  end

  def params_list(how_many, attrs \\ %{}),
    do: Enum.map(1..how_many, fn _ -> params(attrs) end)

  defp defaults,
    do: %{
      first_name: Enum.random([Faker.Name.first_name(), nil]),
      last_name: Faker.Name.last_name(),
      middle_name: middle_name()
    }

  defp middle_name() do
    case Enum.random([nil, 1]) do
      nil ->
        nil

      _ ->
        1..5
        |> Enum.random()
        |> Faker.String.base64()
        |> String.capitalize()
    end
  end

  def assoc do
    user = RegFactory.insert()
    project = ProjectFactory.insert(user_id: user.id)

    assoc = %{
      user: user,
      project: project
    }

    assoc_ids = %{
      user_id: user.id,
      project_id: project.id
    }

    {assoc, assoc_ids}
  end

  def stringify(%Author{} = attrs) do
    attrs
    |> Map.from_struct()
    |> stringify()
  end

  def stringify(%{} = attrs),
    do:
      attrs
      |> Factory.reject_attrs()
      |> Enum.map(fn
        {k, v} when k in @simple_attrs ->
          {Factory.to_camel_key(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})
end
