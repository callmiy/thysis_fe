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
    field(:citation, :string)
    field(:year, :integer)
    belongs_to(:source_type, SourceType)
    has_many(:quotes, Quote)

    timestamps()
  end

  @doc false
  def changeset(source, attrs \\ %{}) do
    source
    |> cast(attrs, [:year, :citation, :source_type_id])
    |> validate_required([:year, :citation, :source_type_id])
    |> validate_format(:citation, ~r/\d{4}/)
  end
end
