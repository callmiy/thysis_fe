defmodule Thysis.Sources.Source do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Quote
  alias Thysis.SourceType
  alias Thysis.Author
  alias Thysis.AuthorApi
  alias Thysis.SourceAuthor
  alias Thysis.Sources
  alias Thysis.Projects.Project
  alias Thysis.Accounts.User

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "sources" do
    field(:author_attrs, {:array, :map}, virtual: true)
    field(:author_ids, {:array, :id}, virtual: true)
    field(:deleted_authors, {:array, :id}, virtual: true)
    field(:topic, :string)
    field(:year, :string)
    field(:publication, :string)
    field(:url, :string)
    belongs_to(:source_type, SourceType)
    belongs_to(:project, Project)
    belongs_to(:user, User)
    has_many(:quotes, Quote)
    has_many(:source_authors, SourceAuthor)
    many_to_many(:authors, Author, join_through: "source_authors")

    timestamps()
  end

  @doc false
  def changeset(source, attrs \\ %{})

  def changeset(%{id: nil} = source, attrs) do
    {author_ids, author_attrs, changes} = cast_default(source, attrs)

    validate_authors(author_ids, author_attrs, changes)
  end

  def changeset(source, attrs) do
    {_, _, changes} = cast_default(source, attrs)
    changes
  end

  defp cast_default(source, attrs) do
    changes =
      cast(source, attrs, [
        :topic,
        :year,
        :publication,
        :url,
        :source_type_id,
        :author_ids,
        :author_attrs,
        :deleted_authors,
        :project_id,
        :user_id
      ])
      |> validate_required([:topic, :source_type_id, :project_id, :user_id])
      |> assoc_constraint(:source_type)
      |> foreign_key_constraint(:project, name: "sources_project_id_user_id_fk")

    {author_ids, changes} = validate_author_ids(changes)
    {author_attrs, changes} = validate_author_attrs(changes)
    {author_ids, author_attrs, changes}
  end

  defp validate_authors(_, _, %{valid?: false} = changes), do: changes

  defp validate_authors(nil, nil, changes),
    do:
      add_error(
        changes,
        :authors,
        Sources.author_required_error_string()
      )

  defp validate_authors(_, _, changes), do: changes

  defp validate_author_ids(changes) do
    case fetch_field(changes, :author_ids) |> get_data_or_error() do
      nil ->
        {nil, changes}

      ids ->
        authors = AuthorApi.list(ids)
        author_ids = Enum.map(authors, & &1.id)

        invalid_ids =
          Enum.reduce(ids, [], fn id, acc ->
            # ids can be given as list of string or integer so we always convert
            case Enum.member?(author_ids, String.to_integer("#{id}")) do
              true -> acc
              _ -> [id | acc]
            end
          end)

        changes = put_change(changes, :author_ids, authors)

        case invalid_ids do
          [] ->
            {ids, changes}

          _ ->
            changes =
              add_error(
                changes,
                :author_ids,
                Sources.invalid_ids_error_string(invalid_ids)
              )

            {ids, changes}
        end
    end
  end

  defp validate_author_attrs(changes) do
    case fetch_field(changes, :author_attrs) |> get_data_or_error() do
      nil ->
        {nil, changes}

      author_attrs ->
        case stringify_errors(author_attrs) do
          [] ->
            {author_attrs, changes}

          errors ->
            changes =
              add_error(
                changes,
                :author_attrs,
                Enum.join(errors, " | ")
              )

            {author_attrs, changes}
        end
    end
  end

  defp get_data_or_error(:error), do: nil
  defp get_data_or_error({:data, nil}), do: nil
  defp get_data_or_error({_, val}) when is_list(val), do: val

  defp stringify_errors(data) do
    Enum.reduce(data, [], fn attr, acc ->
      case AuthorApi.change_(%Author{}, attr) do
        %{valid?: true} ->
          acc

        %{errors: errors} ->
          [errors | acc]
      end
    end)
    |> List.flatten()
    |> Enum.uniq()
    |> Enum.map(fn {key, {message, info}} ->
      key = Atom.to_string(key)

      case Enum.map(info, &stringify_keyword_list/1) |> Enum.join(",") do
        "" -> "[#{key}: {#{message}}]"
        info -> "[#{key}: {#{message}, [#{info}] }]"
      end
    end)
  end

  defp stringify_keyword_list({key, val}) when is_atom(val) do
    val = Atom.to_string(val)
    stringify_keyword_list({key, val})
  end

  defp stringify_keyword_list({key, val}) when is_binary(val) do
    key = Atom.to_string(key)
    "#{key}: #{val}"
  end

  defp stringify_keyword_list({key, _}), do: stringify_keyword_list({key, key})
end
