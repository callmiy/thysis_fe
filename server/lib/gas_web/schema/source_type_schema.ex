defmodule GasWeb.SourceTypeSchema do
  @moduledoc """
  Schema types for source_type
  """

  use Absinthe.Schema.Notation

  alias GasWeb.SourceTypeResolver

  @desc "A source type"
  object :source_type do
    field(:id, non_null(:id))
    field(:name, :string)
  end

  @desc "Get source type input"
  input_object :get_source_type_input do
    field(:id, :id)
    field(:name, :string)
  end

  @desc "Queries allowed on the source type object"
  object :source_type_query do
    @desc "Get a source type"
    field :source_type, type: :source_type do
      arg(:source_type, non_null(:get_source_type_input))

      resolve(&SourceTypeResolver.source_type/3)
    end

    field :source_types, type: list_of(:source_type) do
      resolve(&SourceTypeResolver.source_types/3)
    end
  end
end
