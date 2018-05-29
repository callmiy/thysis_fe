defmodule Gas.Quote do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Source
  alias Gas.Tag

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "quotes" do
    field(:text, :string)
    field(:date, :date)
    field(:page_start, :integer)
    field(:page_end, :integer)
    belongs_to(:source, Source)
    many_to_many(:tags, Tag, join_through: "quote_tags")

    timestamps()
  end

  @doc false
  def changeset(quote, attrs \\ %{}) do
    quote
    |> cast(attrs, [:date, :page_start, :page_end, :text, :source_id])
    |> validate_required([:date, :page_start, :text, :source_id])
  end
end
