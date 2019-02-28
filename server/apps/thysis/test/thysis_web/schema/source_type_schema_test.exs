defmodule ThysisWeb.SourceTypeSchemaTest do
  use Thysis.DataCase
  alias ThysisWeb.Schema
  alias ThysisWeb.Query.SourceType, as: Query
  alias Thysis.SourceType
  alias Thysis.Factory.SourceType, as: Factory
  alias Thysis.Factory.Registration, as: RegFactory

  describe "query" do
    test "get source type by id" do
      user = RegFactory.insert()
      %SourceType{id: id} = Factory.insert(user: user)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "sourceType" => %{
                    "id" => ^id,
                    "name" => _
                  }
                }
              }} =
               Absinthe.run(
                 Query.query(:source_type),
                 Schema,
                 variables: %{
                   "sourceType" => %{
                     "id" => id
                   }
                 },
                 context: %{current_user: user}
               )
    end

    # @tag :skip
    test "get source type by name" do
      user = RegFactory.insert()
      %SourceType{name: name} = Factory.insert(user: user, name: "name1")
      Factory.insert(user: user, name: "name2")

      assert {:ok,
              %{
                data: %{
                  "sourceType" => %{
                    "id" => _,
                    "name" => ^name
                  }
                }
              }} =
               Absinthe.run(
                 Query.query(:source_type),
                 Schema,
                 variables: %{
                   "sourceType" => %{
                     "name" => name
                   }
                 },
                 context: %{current_user: user}
               )
    end

    # @tag :skip
    test "get all source_types succeeds" do
      user = RegFactory.insert()
      # first source_type
      Factory.insert(user: user)

      # 2nd source_type
      %{name: name, id: id} = Factory.insert(user: user)
      id = inspect(id)

      # 3rd source type belonging to random user
      Factory.insert()

      assert {:ok,
              %{
                data: %{
                  "sourceTypes" => source_types
                }
              }} =
               Absinthe.run(Query.query(:source_types), Schema, context: %{current_user: user})

      assert length(source_types) == 2
      assert %{"id" => ^id, "name" => ^name} = List.last(source_types)
    end
  end

  describe "mutation" do
    test "create source type succeeds" do
      user = RegFactory.insert()

      %{"name" => name} =
        attrs =
        Factory.params()
        |> Factory.stringify()

      # user_id = Integer.to_string(user.id)

      variables = %{
        "sourceType" => attrs
      }

      assert {:ok,
              %{
                data: %{
                  "sourceType" => %{
                    "name" => ^name
                  }
                }
              }} =
               Absinthe.run(Query.create(), Schema,
                 variables: variables,
                 context: context(user)
               )
    end
  end

  defp context(user), do: %{current_user: user}
end
