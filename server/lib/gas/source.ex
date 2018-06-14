defmodule Gas.Source do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Quote
  alias Gas.SourceType

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "sources" do
    field(:author, :string)
    field(:topic, :string)
    field(:year, :string)
    field(:publication, :string)
    field(:url, :string)
    belongs_to(:source_type, SourceType)
    has_many(:quotes, Quote)

    timestamps()
  end

  @doc false
  def changeset(source, attrs \\ %{}) do
    source
    |> cast(attrs, [
      :author,
      :topic,
      :year,
      :publication,
      :url,
      :source_type_id
    ])
    |> validate_required([:author, :topic, :source_type_id])
  end
end
