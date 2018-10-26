defmodule ThisesWeb.AuthorSchemaTest do
  use Thises.DataCase
  alias ThisesWeb.Schema
  alias ThisesWeb.Query.Author, as: Query
  alias Thises.Author
  alias Thises.Factory.Author, as: Factory
  alias Thises.Factory.Project, as: ProjectFactory

  describe "query" do
    # @tag :skip
    test "get author by id" do
      {assoc, assoc_ids} = Factory.assoc()
      %Author{id: id} = Factory.insert(assoc_ids)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "author" => %{
                    "id" => ^id,
                    "lastName" => _,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Query.query(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "id" => id
                   }
                 },
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "get all authors for user succeeds" do
      {assoc, assoc_ids} = Factory.assoc()
      # first author
      Factory.insert(assoc_ids)

      # 2nd author
      %{last_name: last_name, id: id} = Factory.insert(assoc_ids)
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "authors" => authors
                }
              }} =
               Absinthe.run(
                 Query.query(:authors),
                 Schema,
                 context: context(assoc.user)
               )

      assert length(authors) == 2
      assert %{"id" => ^id, "lastName" => ^last_name} = List.last(authors)
    end

    # @tag :skip
    test "get all authors for project succeeds" do
      {assoc, assoc_ids} = Factory.assoc()
      # first author
      Factory.insert(assoc_ids)

      project = ProjectFactory.insert(user_id: assoc.user.id)

      # authors belonging to other projects of same author
      Factory.insert_list(2, Map.put(assoc_ids, :project_id, project.id))

      variables = %{
        "author" => %{
          "projectId" => project.id
        }
      }

      assert {:ok,
              %{
                data: %{
                  "authors" => authors
                }
              }} =
               Absinthe.run(
                 Query.query(:authors),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )

      assert length(authors) == 2
    end
  end

  describe "mutation" do
    # @tag :skip
    test "create author succeeds" do
      {assoc, assoc_ids} = Factory.assoc()

      attrs =
        Factory.params(assoc_ids)
        |> Factory.stringify()

      variables = %{
        "author" => attrs
      }

      assert {:ok,
              %{
                data: %{
                  "createAuthor" => %{
                    "id" => _,
                    "lastName" => _
                  }
                }
              }} =
               Absinthe.run(
                 Query.mutation(:author),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end
  end

  defp context(%{} = user) do
    %{current_user: user}
  end
end
