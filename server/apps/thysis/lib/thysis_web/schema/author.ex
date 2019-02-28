defmodule ThysisWeb.Schema.Author do
  @moduledoc """
  Schema types for Author
  """

  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias ThysisWeb.Resolver.Author, as: Resolver

  @desc "An Author"
  object :author do
    field(:id, non_null(:id))
    field(:first_name, :string)
    field(:last_name, non_null(:string))
    field(:middle_name, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))

    field(
      :sources,
      list_of(:source) |> non_null(),
      resolve: dataloader(Thysis.Sources)
    )
  end

  @desc "Get author input"
  input_object :get_author_input do
    field(:id, :id |> non_null())
  end

  @desc "Get authors input"
  input_object :get_authors_input do
    @desc "ID of project"
    field(:project_id, :id)
  end

  @desc "Input for creating an author"
  input_object :create_author_input do
    field(:first_name, :string)
    field(:last_name, :string |> non_null())
    field(:project_id, :id |> non_null())
    field(:user_id, :id |> non_null())
    field(:middle_name, :string)
  end

  @desc "Input for updating an author"
  input_object :update_author_input do
    @desc "ID of author to be updated"
    field(:id, :id |> non_null())
    field(:first_name, :string)
    field(:last_name, :string)
    field(:middle_name, :string)
  end

  @desc "Queries allowed on the Author object"
  object :author_query do
    @desc "Get a single author"
    field :author, type: :author do
      arg(:author, non_null(:get_author_input))

      resolve(&Resolver.author/3)
    end

    field :authors, type: list_of(:author) do
      arg(:author, non_null(:get_authors_input))
      resolve(&Resolver.authors/3)
    end
  end

  @desc "The mutations allowed on the Author object"
  object :author_mutation do
    @desc "Create an author"
    field :create_author, type: :author do
      arg(:author, non_null(:create_author_input))

      resolve(&Resolver.create_author/3)
    end

    @desc "Update an author"
    field :update_author, type: :author do
      arg(:author, non_null(:update_author_input))

      resolve(&Resolver.update/3)
    end
  end
end
