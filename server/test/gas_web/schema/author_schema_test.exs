defmodule GasWeb.AuthorSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.Query.Author, as: AuthorQuery, as: Queries
  alias Gas.Author
  alias Gas.Factory.Author, as: AuthorFactory
  # alias Gas.MapHelpers

  describe "query" do
    # @tag :skip
    test "get author by id" do
      %Author{id: id} = AuthorFactory.insert()
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
                 Queries.query(:author),
                 Schema,
                 variables: %{
                   "author" => %{
                     "id" => id
                   }
                 }
               )
    end

    # @tag :skip
    test "get all authors succeeds" do
      # first author
      AuthorFactory.insert()

      # 2nd author
      %{last_name: last_name, id: id} = AuthorFactory.insert()
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "authors" => authors
                }
              }} = Absinthe.run(Queries.query(:authors), Schema)

      assert length(authors) == 2
      assert %{"id" => ^id, "lastName" => ^last_name} = List.last(authors)
    end
  end

  describe "mutation" do
    # @tag :skip
    test "create author succeeds" do
      attrs =
        AuthorFactory.params()
        |> AuthorFactory.stringify()

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
                 Queries.mutation(:author),
                 Schema,
                 variables: %{
                   "author" => attrs
                 }
               )
    end
  end
end
