defmodule GasWeb.AuthorSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.AuthorQueries, as: Queries
  alias Gas.Author
  # alias Gas.MapHelpers

  describe "query" do
    test "get author by id" do
      %Author{id: id} = insert(:author)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "author" => %{
                    "id" => ^id,
                    "name" => _,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "id" => id
                   }
                 }
               )
    end

    test "get author by name" do
      %Author{name: name} = insert(:author)

      assert {:ok,
              %{
                data: %{
                  "author" => %{
                    "id" => _,
                    "name" => ^name,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "name" => name
                   }
                 }
               )
    end

    test "get author by id and name" do
      %Author{id: id, name: name} = insert(:author)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "author" => %{
                    "id" => ^id,
                    "name" => ^name,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "id" => id,
                     "name" => name
                   }
                 }
               )
    end

    test "get all authors succeeds" do
      # first author
      insert(:author)

      # 2nd author
      %{name: name, id: id} = insert(:author)
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "authors" => authors
                }
              }} = Absinthe.run(Queries.query(:authors), Schema)

      assert length(authors) == 2
      assert %{"id" => ^id, "name" => ^name} = List.last(authors)
    end
  end

  describe "mutation" do
    test "create author succeeds" do
      name = "Awesome author"

      assert {:ok,
              %{
                data: %{
                  "createAuthor" => %{
                    "id" => _,
                    "name" => ^name
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "name" => name
                   }
                 }
               )
    end
  end
end
