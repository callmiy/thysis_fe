defmodule ThysisWeb.Schema.SourceType do
  @moduledoc """
  Schema types for source_type
  """

  use Absinthe.Schema.Notation

  # import ThysisWeb.Schema.Types, only: [iso_datetime_to_str: 1]

  alias ThysisWeb.Resolver.SourceType, as: Resolver

  @desc "A source type"
  object :source_type do
    field(:id, non_null(:id))
    field(:name, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  # INPUTS
  @desc "Get source type input"
  input_object :get_source_type_input do
    field(:id, :id)
    field(:name, :string)
  end

  @desc "Create source type input"
  input_object :create_source_type_input do
    field(:name, :string |> non_null())
  end

  @desc "Queries allowed on the source type object"
  object :source_type_query do
    @desc "Get a source type"
    field :source_type, type: :source_type do
      arg(:source_type, non_null(:get_source_type_input))

      resolve(&Resolver.source_type/3)
    end

    field :source_types, type: list_of(:source_type) do
      resolve(&Resolver.source_types/3)
    end
  end

  @desc "Mutation allowed on the source type object"
  object :source_type_mutation do
    @desc "Create a source type"
    field :source_type, type: :source_type do
      arg(:source_type, non_null(:create_source_type_input))

      resolve(&Resolver.create/3)
    end
  end

  def source_types_query(sts) do
    Enum.map(sts, &source_type_query/1)
  end

  def source_type_query(st) do
    %{
      "id" => Integer.to_string(st.id),
      "name" => st.name,
      "__typename" => "SourceType"
      # "updatedAt" => iso_datetime_to_str(st.updated_at)
    }
  end
end
