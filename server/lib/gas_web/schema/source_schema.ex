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
    field(:publication, :string)
    field(:url, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))

    field(:source_type, non_null(:source_type), resolve: assoc(:source_type))
    field(:quotes, list_of(:quote), resolve: assoc(:quotes))

    field :display, :string do
      resolve(&SourceResolver.display/3)
    end
  end

  # MUTATION INPUTS
  @desc "Inputs for creating a source"
  input_object :create_source_input do
    @desc "The original owner of the work - mandatory"
    field(:author, non_null(:string))

    @desc "The topic of the work, as given by authour - manadatory"
    field(:topic, non_null(:string))

    @desc "The source type i.e. book, journal etc. - mandatory"
    field(:source_type_id, non_null(:id))

    @desc "For which conference was this work published - optional"
    field(:publication, :string)

    @desc ~S{The URI where author's original work can be accessed - optional}
    field(:url, :string)
  end

  # QUERY INPUTS
  @desc "Input for getting a source"
  input_object :get_source_input do
    @desc "ID of source"
    field(:id, non_null(:id))
  end

  # QUERIES
  @desc "Queries allowed on the source object"
  object :source_query do
    @desc "Query for all sources"
    field :sources, type: list_of(:source) do
      resolve(&SourceResolver.sources/3)
    end

    @dec "Query for a source"
    field :source, type: :source do
      arg(:source, non_null(:get_source_input))
      resolve(&SourceResolver.source/3)
    end
  end

  # MUTATIONS
  @desc "Mutations that may be performed on source object"
  object :source_mutation do
    field :create_source, type: :source do
      arg(:source, non_null(:create_source_input))
      resolve(&SourceResolver.create_source/3)
    end
  end
end
