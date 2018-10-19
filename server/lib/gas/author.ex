defmodule Gas.Author do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Source

  schema "authors" do
    field(:first_name, :string)
    field(:last_name, :string)
    field(:middle_name, :string)
    many_to_many(:sources, Source, join_through: "source_authors")

    timestamps()
  end

  @doc false
  def changeset(author, attrs \\ %{}) do
    author
    |> cast(attrs, [:first_name, :last_name, :middle_name])
    |> validate_required([:last_name])
  end
end
