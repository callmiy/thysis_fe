defmodule Thysis.Factory.Source do
  use Thysis.Factory

  @dialyzer {:no_return, [insert: 1, insert: 0]}

  alias Thysis.Factory
  alias Thysis.Factory.SourceType, as: SourceTypeFactory
  alias Thysis.Factory.Author, as: AuthorFactory
  alias Thysis.Sources
  alias Thysis.Sources.Source
  alias Thysis.Factory.Project, as: ProjectFactory
  alias Thysis.Factory.Registration, as: RegFactory

  @simple_attrs [
    :topic,
    :year,
    :publication,
    :url,
    :source_type_id,
    :project_id,
    :user_id,
    :id
  ]

  def insert(attrs) do
    {:ok, data} =
      attrs
      |> params()
      |> Sources.create_()

    data.source
  end

  def insert_with_assoc(attrs \\ %{}),
    do:
      attrs
      |> params_with_assoc()
      |> insert()

  def params(attrs) do
    attrs =
      attrs
      |> params_no_authors()
      |> Map.merge(authors(attrs))

    attrs
  end

  def params_no_authors(attrs \\ %{})

  def params_no_authors(attrs) when is_list(attrs),
    do:
      attrs
      |> Map.new()
      |> params_no_authors

  def params_no_authors(attrs) do
    defaults()
    |> Map.merge(attrs)
  end

  def params_with_assoc(attrs \\ %{}) do
    {_, assoc_ids} = assoc()

    attrs =
      attrs
      |> params_no_authors()
      |> Map.merge(assoc_ids)

    Map.merge(attrs, authors(attrs))
  end

  defp defaults,
    do: %{
      topic: Faker.String.base64(),
      year: Enum.random([Integer.to_string(Factory.random_date().year), nil]),
      publication: Enum.random([Faker.String.base64(), nil]),
      url: Enum.random([Faker.Internet.url(), nil])
    }

  def assoc do
    user = RegFactory.insert()
    project = ProjectFactory.insert(user_id: user.id)
    source_type = SourceTypeFactory.insert(user_id: user.id)

    assoc = %{
      user: user,
      project: project,
      source_type: source_type
    }

    assoc_ids = %{
      user_id: user.id,
      project_id: project.id,
      source_type_id: source_type.id
    }

    {assoc, assoc_ids}
  end

  def stringify(%Source{} = source),
    do:
      source
      |> Map.from_struct()
      |> stringify()

  def stringify(%{} = attrs),
    do:
      attrs
      |> Factory.reject_attrs()
      |> Enum.map(fn
        {:source_type, source_type} ->
          {"sourceType", SourceTypeFactory.stringify(source_type)}

        {:project, project} ->
          {"project", ProjectFactory.stringify(project)}

        {:author_ids, ids} ->
          {"authorIds", Enum.map(ids, &Integer.to_string/1)}

        {:author_attrs, attrs} ->
          {"authorAttrs", Enum.map(attrs, &AuthorFactory.stringify/1)}

        {k, v} when k in @simple_attrs ->
          {Factory.to_camel_key(k), v}

        _ ->
          nil
      end)
      |> Enum.reject(&(&1 == nil))
      |> Enum.into(%{})

  defp authors(%{} = attrs) do
    case {Map.has_key?(attrs, :author_ids), Map.has_key?(attrs, :author_attrs)} do
      {false, false} ->
        1..5
        |> Enum.random()
        |> authors_ids_maps(attrs)

      {true, false} ->
        %{
          author_ids: Map.get(attrs, :author_ids),
          author_attrs: make_author_attrs(nil, attrs)
        }

      {false, true} ->
        %{
          author_ids: make_author_ids(nil, attrs),
          author_attrs: Map.get(attrs, :author_attrs)
        }

      _ ->
        attrs
    end
  end

  defp authors_ids_maps(how_many, attrs) do
    {author_attrs, author_ids} =
      case Enum.random([:author_attrs, :author_ids, how_many]) do
        :author_attrs ->
          {make_author_attrs(nil, attrs), nil}

        :author_ids ->
          {nil, make_author_ids(nil, attrs)}

        ^how_many ->
          {make_author_attrs(how_many, attrs), make_author_ids(how_many, attrs)}
      end

    %{
      author_ids: author_ids,
      author_attrs: author_attrs
    }
  end

  defp make_author_attrs(how_many, attrs) do
    how_many = if how_many == nil, do: 5, else: how_many

    1..Faker.random_between(1, how_many)
    |> Enum.map(fn _ ->
      AuthorFactory.params(project_id: attrs.project_id, user_id: attrs.user_id)
    end)
  end

  defp make_author_ids(how_many, attrs) do
    how_many = if how_many == nil, do: 5, else: how_many

    Faker.random_between(1, how_many)
    |> AuthorFactory.insert_list(
      project_id: attrs.project_id,
      user_id: attrs.user_id
    )
    |> Enum.map(& &1.id)
  end
end
