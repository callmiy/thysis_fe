defmodule GasWeb.TagSchema do
  @moduledoc """
  Schema types for Tag
  """

  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Gas.Repo

  alias alias GasWeb.TagResolver

  @desc "A Tag"
  object :tag do
    field(:id, non_null(:id))
    field(:text, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  @desc "Get tag input"
  input_object :get_tag_input do
    field(:id, :id)
    field(:text, :string)
  end

  @desc "List of tags, may be paginated"
  object :tags do
    field(:tags, list_of(:tag))
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
end
