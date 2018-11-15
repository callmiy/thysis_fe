defmodule ThysisWeb.Schema.ProjectTest do
  use Thysis.DataCase, async: false

  alias Thysis.Factory.Project, as: Factory
  alias ThysisWeb.Schema
  alias ThysisWeb.Query.Project, as: Query

  describe "Mutation" do
    test "creating a project succeeds" do
      %{user: user} = attrs = Factory.params_with_assoc()
      user_id_str = Integer.to_string(user.id)

      queryMap = Query.create()

      query = """
        mutation CreateProject(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "project" => %{
                    "id" => _,
                    "title" => _,
                    "user" => %{
                      "id" => ^user_id_str
                    }
                  }
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "project" => Factory.stringify(attrs)
                 }
               )
    end

    test "creating a project with non existent user fails" do
      attrs =
        Factory.params_with_assoc(user_id: 0)
        |> Factory.stringify()

      queryMap = Query.create()

      query = """
        mutation CreateProject(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                errors: [
                  %{
                    message: "{\"user\":\"does not exist\"}"
                  }
                ]
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "project" => attrs
                 }
               )
    end
  end

  describe "query" do
    test "Get projects for authenticated user succeeds" do
      %{user: user} = project1 = Factory.params_with_assoc()
      project1 = Factory.insert(project1)
      project2 = Factory.insert(user_id: user.id)

      ids =
        [project1, project2]
        |> Enum.map(&Integer.to_string(&1.id))
        |> Enum.sort()

      queryMap = Query.list()

      query = """
        query ListUserProjects {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "projects" => projects
                }
              }} = Absinthe.run(query, Schema, context: context(user))

      assert projects
             |> Enum.map(& &1["id"])
             |> Enum.sort()
             |> Kernel.==(ids)
    end

    test "Get project for authenticated user succeeds" do
      %{user: user} = attrs = Factory.params_with_assoc()
      user_id = Integer.to_string(user.id)
      %{id: id} = Factory.insert(attrs)
      id = Integer.to_string(id)

      queryMap = Query.get()

      query = """
        query GetUserProject(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "project" => %{
                    "id" => ^id,
                    "user" => %{
                      "id" => ^user_id
                    }
                  }
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{"project" => %{"id" => id}},
                 context: %{current_user: user}
               )
    end
  end

  defp context(user), do: %{current_user: user}
end
