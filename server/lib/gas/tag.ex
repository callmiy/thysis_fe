defmodule Gas.Tag do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Quote

  schema "tags" do
    field(:text, :string)
    many_to_many(:quotes, Quote, join_through: "quote_tags")

    timestamps()
  end

  @doc false
  def changeset(tag, attrs \\ %{}) do
    tag
    |> cast(attrs, [:text])
    |> validate_required([:text])
  end
end
