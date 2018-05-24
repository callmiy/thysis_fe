defmodule Gas.Quote do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Source

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "quotes" do
    field(:date, :date)
    field(:page_start, :integer)
    field(:page_end, :integer)
    field(:text, :string)
    belongs_to(:source, Source)

    timestamps()
  end

  @doc false
  def changeset(quote, attrs \\ %{}) do
    quote
    |> cast(attrs, [:date, :page_start, :page_end, :text, :source_id])
    |> validate_required([:date, :page_start, :text, :source_id])
  end
end
