defmodule ThisesWeb.SourceTypeSchemaTest do
  use Thises.DataCase
  alias ThisesWeb.Schema
  alias ThisesWeb.Query.SourceType, as: SourceTypeQuery
  alias Thises.SourceType
  alias Thises.Factory.SourceType, as: Factory
  alias Thises.Factory.Registration, as: RegFactory

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
                 SourceTypeQuery.query(:source_type),
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
                 SourceTypeQuery.query(:source_type),
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
               Absinthe.run(SourceTypeQuery.query(:source_types), Schema,
                 context: %{current_user: user}
               )

      assert length(source_types) == 2
      assert %{"id" => ^id, "name" => ^name} = List.last(source_types)
    end
  end
end
