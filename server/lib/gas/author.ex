defmodule Gas.Author do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Source

  schema "authors" do
    field(:name, :string)
    many_to_many(:sources, Source, join_through: "source_authors")

    timestamps()
  end

  @doc false
  def changeset(author, attrs \\ %{}) do
    author
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
