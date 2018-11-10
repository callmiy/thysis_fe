defmodule Thysis.Tag do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Quote

  schema "tags" do
    field(:text, :string)
    field(:question, :string)
    many_to_many(:quotes, Quote, join_through: "quote_tags")

    timestamps()
  end

  @doc false
  def changeset(tag, attrs \\ %{}) do
    tag
    |> cast(attrs, [:text, :question])
    |> validate_required([:text])
    |> unique_constraint(:text, name: :tags_text)
  end
end
