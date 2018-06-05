defmodule GasWeb.SourceSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.SourceQueries, as: Queries
  alias Gas.Source
  alias Gas.MapHelpers

  describe "query" do
    test "get all sources succeeds" do
      # first source
      insert(:source)

      # 2nd source
      %Source{
        author: author,
        id: id,
        source_type_id: source_type_id
      } = insert(:source)

      id = inspect(id)
      source_type_id = inspect(source_type_id)

      assert {:ok,
              %{
                data: %{
                  "sources" => sources
                }
              }} = Absinthe.run(Queries.query(:sources), Schema)

      assert length(sources) == 2

      assert %{
               "id" => ^id,
               "author" => ^author,
               "display" => display,
               "sourceType" => %{
                 "id" => ^source_type_id
               }
             } = List.last(sources)

      assert String.contains?(display, author)
    end

    test "get one source succeeds" do
      %Source{
        author: author,
        id: id,
        source_type_id: source_type_id
      } = insert(:source)

      id = Integer.to_string(id)
      source_type_id = inspect(source_type_id)

      assert {:ok,
              %{
                data: %{
                  "source" => %{
                    "id" => ^id,
                    "author" => ^author,
                    "display" => display,
                    "sourceType" => %{
                      "id" => ^source_type_id
                    }
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:source),
                 Schema,
                 variables: %{
                   "source" => %{
                     "id" => id
                   }
                 }
               )

      assert String.contains?(display, author)
    end
  end

  describe "mutatation" do
    test "create source" do
      %{id: source_type_id, name: name} = source_type = insert(:source_type)
      %{author: author} = source = params_for(:source, source_type: source_type)
      source_type_id = Integer.to_string(source_type_id)

      source =
        source
        |> MapHelpers.stringify_keys()
        |> Map.merge(%{"sourceTypeId" => source_type_id})

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "id" => _,
                    "author" => ^author,
                    "sourceType" => %{
                      "id" => ^source_type_id,
                      "name" => ^name
                    }
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:source),
                 Schema,
                 variables: %{
                   "source" => source
                 }
               )
    end
  end
end
