defmodule Thysis.Quote do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Sources.Source
  alias Thysis.Tag

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  @cast_attrs [
    :date,
    :page_start,
    :page_end,
    :text,
    :source_id,
    :volume,
    :issue,
    :extras
  ]

  schema "quotes" do
    field(:text, :string)
    field(:date, :date)
    field(:page_start, :integer)
    field(:page_end, :integer)
    field(:volume, :string)
    field(:issue, :string)
    field(:extras, :string)
    belongs_to(:source, Source)
    many_to_many(:tags, Tag, join_through: "quote_tags")

    timestamps()
  end

  @doc false
  def changeset(quote, attrs \\ %{}) do
    quote
    |> cast(attrs, @cast_attrs)
    |> validate_required([:text, :source_id])
    |> assoc_constraint(:source)
  end
end
