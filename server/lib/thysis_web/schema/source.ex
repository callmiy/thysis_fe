defmodule ThysisWeb.Schema.Source do
  @moduledoc """
  Schema for source
  """

  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias ThysisWeb.Resolver.Source, as: Resolver

  @desc "A source"
  object :source do
    field(:id, non_null(:id))
    field(:topic, non_null(:string))
    field(:year, :string)
    field(:publication, :string)
    field(:url, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))

    field(
      :authors,
      list_of(:author) |> non_null(),
      resolve: dataloader(Thysis.AuthorApi)
    )

    field(
      :source_type,
      non_null(:source_type),
      resolve: dataloader(Thysis.SourceTypeApi)
    )

    field(:quotes, list_of(:quote), resolve: dataloader(Thysis.QuoteApi))

    # field(:display, :string, do: resolve(&Resolver.display/3))
    field(
      :display,
      :string,
      deprecate: "Client should handle display",
      resolve: &Resolver.display/3
    )
  end

  # MUTATION INPUTS
  @desc "Inputs for creating a source with authors"
  input_object :create_source_input do
    @desc "ID of project to which source belongs"
    field(:project_id, non_null(:id))

    # The user must always be authenticated and must come from the context
    # @desc "ID of user to whom source belongs"
    # field(:user_id, non_null(:id))

    @desc "The topic of the work, as given by authors - mandatory"
    field(:topic, non_null(:string))

    @desc "The source type i.e. book, journal etc. - mandatory"
    field(:source_type_id, non_null(:id))

    @desc "The year the source was published"
    field(:year, :string)

    @desc "For which conference was this work published - optional"
    field(:publication, :string)

    @desc ~S{The URI where author's original work can be accessed - optional}
    field(:url, :string)

    @desc "The original owners of the work - Either author creation inputs
    or list of author IDs, one of which is mandatory"
    field(:author_attrs, list_of(:create_author_input))
    field(:author_ids, list_of(:id))
  end

  @desc "Inputs for updating a source"
  input_object :update_source_input do
    @desc "ID of source to be updated"
    field(:id, non_null(:id))

    @desc "The topic of the work, as given by authors"
    field(:topic, :string)

    @desc "The source type i.e. book, journal etc. - if needed to be changed"
    field(:source_type_id, :id)

    @desc "The year the source was published"
    field(:year, :string)

    @desc "For which conference was this work published"
    field(:publication, :string)

    @desc ~S{The URI where author's original work can be accessed}
    field(:url, :string)

    @desc "The new authors we wish to add by attributes"
    field(:author_attrs, list_of(:create_author_input))

    @desc "New authors we wish to add by IDs"
    field(:author_ids, list_of(:id))

    @desc "The authors we wish to delete"
    field(:deleted_authors, list_of(:id))
  end

  # QUERY INPUTS
  @desc "Input for getting a source"
  input_object :get_source_input do
    @desc "ID of source"
    field(:id, non_null(:id))
  end

  @desc "Input for getting a sources belonging to a project or user"
  input_object :get_sources_input do
    @desc "ID of project"
    field(:project_id, non_null(:id))
  end

  # QUERIES
  @desc "Queries allowed on the source object"
  object :source_query do
    @desc "Query for all sources"
    field :sources, type: list_of(:source) do
      arg(:source, non_null(:get_sources_input))
      resolve(&Resolver.sources/3)
    end

    @dec "Query for a source"
    field :source, type: :source do
      arg(:source, non_null(:get_source_input))

      resolve(&Resolver.source/3)
    end
  end

  # MUTATIONS
  @desc "Mutations that may be performed on source object"
  object :source_mutation do
    @desc "create source mutation"
    field :create_source, type: :source do
      arg(:source, non_null(:create_source_input))
      resolve(&Resolver.create/3)
    end

    @desc "update source mutation"
    field :update_source, type: :source do
      arg(:source, non_null(:update_source_input))
      resolve(&Resolver.update/3)
    end
  end
end
