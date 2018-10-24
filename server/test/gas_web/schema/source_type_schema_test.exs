defmodule GasWeb.SourceTypeSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.Query.SourceType, as: SourceTypeQuery
  alias Gas.SourceType

  describe "query" do
    test "get source type by id" do
      %SourceType{id: id} = insert(:source_type)
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
                 }
               )
    end

    test "get source type by name" do
      %SourceType{name: name} = insert(:source_type)

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
                 }
               )
    end

    test "get source_type by id and name" do
      %SourceType{id: id, name: name} = insert(:source_type)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "sourceType" => %{
                    "id" => ^id,
                    "name" => ^name
                  }
                }
              }} =
               Absinthe.run(
                 SourceTypeQuery.query(:source_type),
                 Schema,
                 variables: %{
                   "sourceType" => %{
                     "id" => id,
                     "name" => name
                   }
                 }
               )
    end

    test "get all source_types succeeds" do
      # first source_type
      insert(:source_type)

      # 2nd source_type
      %{name: name, id: id} = insert(:source_type)
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "sourceTypes" => source_types
                }
              }} = Absinthe.run(SourceTypeQuery.query(:source_types), Schema)

      assert length(source_types) == 2
      assert %{"id" => ^id, "name" => ^name} = List.last(source_types)
    end
  end
end
