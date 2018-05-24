defmodule Gas.SourceType do
  use Ecto.Schema
  import Ecto.Changeset

  alias Gas.Source

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "source_types" do
    field(:name, :string)
    has_many(:sources, Source)
  end

  @doc false
  def changeset(source_type, attrs \\ %{}) do
    source_type
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
