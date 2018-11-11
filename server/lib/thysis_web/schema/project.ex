defmodule ThysisWeb.Schema.Project do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]
  import ThysisWeb.Schema.Types, only: [iso_datetime_to_str: 1]

  alias ThysisWeb.Schema
  alias Thysis.Accounts.UserApi
  alias ThysisWeb.Resolver.Project, as: Resolver

  @desc "A Project"
  object :project do
    field :project_id, non_null(:id) do
      resolve(fn project, _, _ ->
        {:ok, project.id}
      end)
    end

    field :_id, non_null(:string) do
      resolve(fn project, _, _ -> {:ok, Schema.get_datetime_id(project.id)} end)
    end

    field :schema_type, non_null(:string) do
      resolve(fn _, _, _ -> {:ok, "Project"} end)
    end

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

  def projects_query(projects) do
    Enum.map(projects, fn p ->
      %{
        "projectId" => Integer.to_string(p.id),
        "title" => p.title,
        "insertedAt" => iso_datetime_to_str(p.inserted_at),
        "updatedAt" => iso_datetime_to_str(p.updated_at),
        "__typename" => "Project"
      }
    end)
  end
end
