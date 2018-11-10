defmodule ThysisWeb.Schema.Tag do
  @moduledoc """
  Schema types for Tag
  """

  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias ThysisWeb.TagResolver

  @desc "A Tag"
  object :tag do
    field(:id, non_null(:id))
    field(:text, non_null(:string))
    field(:question, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
    field(:quotes, list_of(:quote), resolve: dataloader(Thysis.QuoteApi))
  end

  @desc "Get tag input"
  input_object :get_tag_input do
    field(:id, :id)
    field(:text, :string)
  end

  @desc "Input for creating a tag"
  input_object :create_tag_input do
    field(:text, non_null(:string))
    field(:question, :string)
  end

  @desc "Queries allowed on the Tag object"
  object :tag_query do
    @desc "Get a single tag"
    field :tag, type: :tag do
      arg(:tag, non_null(:get_tag_input))

      resolve(&TagResolver.tag/3)
    end

    field :tags, type: list_of(:tag) do
      resolve(&TagResolver.tags/3)
    end
  end

  @desc "The mutations allowed on the Tag object"
  object :tag_mutation do
    @desc "Create a tag"
    field :create_tag, type: :tag do
      arg(:tag, non_null(:create_tag_input))

      resolve(&TagResolver.create_tag/3)
    end
  end
end
