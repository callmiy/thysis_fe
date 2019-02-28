defmodule Thysis.SourceAuthor do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Sources.Source
  alias Thysis.Author

  schema "source_authors" do
    belongs_to(:source, Source)
    belongs_to(:author, Author)

    timestamps()
  end

  @doc false
  def changeset(source_author, attrs \\ %{}) do
    source_author
    |> cast(attrs, [:source_id, :author_id])
    |> validate_required([:source_id, :author_id])
    |> unique_constraint(:source_id_author_id)
  end
end
