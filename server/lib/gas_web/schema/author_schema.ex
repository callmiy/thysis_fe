defmodule GasWeb.AuthorSchema do
  @moduledoc """
  Schema types for Author
  """

  use Absinthe.Schema.Notation

  alias GasWeb.AuthorResolver

  @desc "An Author"
  object :author do
    field(:id, non_null(:id))
    field(:name, non_null(:string))
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  @desc "Get author input"
  input_object :get_author_input do
    field(:id, :id)
    field(:name, :string)
  end

  @desc "Input for creating an author"
  input_object :create_author_input do
    field(:name, non_null(:string))
  end

  @desc "Queries allowed on the Author object"
  object :author_query do
    @desc "Get a single author"
    field :author, type: :author do
      arg(:author, non_null(:get_author_input))

      resolve(&AuthorResolver.author/3)
    end

    field :authors, type: list_of(:author) do
      resolve(&AuthorResolver.authors/3)
    end
  end

  @desc "The mutations allowed on the Author object"
  object :author_mutation do
    @desc "Create an author"
    field :create_author, type: :author do
      arg(:author, non_null(:create_author_input))

      resolve(&AuthorResolver.create_author/3)
    end
  end
end
