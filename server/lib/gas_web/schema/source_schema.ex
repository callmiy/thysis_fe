defmodule GasWeb.SourceSchema do
  @moduledoc """
  Schema for source
  """

  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Gas.Repo

  alias alias GasWeb.SourceResolver

  @desc "A source"
  object :source do
    field(:id, non_null(:id))
    field(:author, non_null(:string))
    field(:topic, non_null(:string))

    field(:source_type, non_null(:source_type), resolve: assoc(:source_type))

    field(:publication, :string)
    field(:url, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  @desc "Get source input"
  input_object :get_source_input do
    field(:id, :id)
  end

  @desc "Queries allowed on the source object"
  object :source_query do
    field :sources, type: list_of(:source) do
      resolve(&SourceResolver.sources/3)
    end
  end
end
