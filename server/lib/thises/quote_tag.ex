defmodule Thysis.QuoteTag do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Quote
  alias Thysis.Tag

  schema "quote_tags" do
    belongs_to(:quote, Quote)
    belongs_to(:tag, Tag)

    timestamps()
  end

  @doc false
  def changeset(quote_tag, attrs \\ %{}) do
    quote_tag
    |> cast(attrs, [:quote_id, :tag_id])
    |> validate_required([:quote_id, :tag_id])
    |> unique_constraint(:quote_id_tag_id)
  end
end
