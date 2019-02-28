defmodule ThysisWeb.Schema.Project do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias Thysis.Accounts.UserApi
  alias ThysisWeb.Resolver.Project, as: Resolver

  @desc "A Project"
  object :project do
    field(:id, non_null(:id))
    field(:title, non_null(:string))
    field(:user, non_null(:user), resolve: dataloader(UserApi))
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  @desc "Variables for creating a Project"
  input_object :create_project_input do
    field(:title, non_null(:string))
    field(:user_id, non_null(:id))
  end

  @desc "Variables for getting a user Project"
  input_object :get_project_input do
    @desc "ID of the project"
    field(:id, non_null(:id))
  end

  @desc "Queries allowed on Project object"
  object :project_query do
    @doc "Get all projects belonging to a user"
    field :projects, list_of(:project) do
      resolve(&Resolver.list/3)
    end

    @doc "Get user's project"
    field :project, :project do
      arg(:project, non_null(:get_project_input))

      resolve(&Resolver.get/3)
    end
  end

  @desc "Mutations allowed on Project object"
  object :project_mutation do
    @doc "Create project for a user"
    field :project, :project do
      arg(:project, non_null(:create_project_input))

      resolve(&Resolver.create/3)
    end
  end
end
