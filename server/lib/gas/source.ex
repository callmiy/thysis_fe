defmodule Gas.Source do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Quote
  alias Gas.SourceType
  alias Gas.Author
  alias Gas.SourceAuthor

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "sources" do
    field(:author_maps, {:array, :map}, virtual: true)
    field(:author_ids, {:array, :id}, virtual: true)
    field(:author, :string)
    field(:topic, :string)
    field(:year, :string)
    field(:publication, :string)
    field(:url, :string)
    belongs_to(:source_type, SourceType)
    has_many(:quotes, Quote)
    has_many(:sources_authors, SourceAuthor)
    many_to_many(:authors, Author, join_through: "source_authors")

    timestamps()
  end

  @doc false
  def changeset(source, attrs \\ %{}) do
    source
    |> cast(attrs, [
      :topic,
      :year,
      :publication,
      :url,
      :source_type_id,
      :author_ids,
      :author_maps
    ])
    |> validate_required([:topic, :source_type_id])
    |> validate_authors()
  end

  defp validate_authors(changes) do
    case changes.valid? do
      true ->
        author_ids = fetch_field(changes, :author_ids)

        case {author_ids, fetch_field(changes, :author)} do
          {:error, :error} ->
            add_error(changes, :author_maps, "author ids or map empty")

          _ ->
            changes
        end

      _ ->
        changes
    end
  end
end
