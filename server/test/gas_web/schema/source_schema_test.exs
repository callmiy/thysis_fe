defmodule GasWeb.SourceSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.SourceQueries
  alias Gas.Source

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
              }} = Absinthe.run(SourceQueries.query(:sources), Schema)

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
  end
end
