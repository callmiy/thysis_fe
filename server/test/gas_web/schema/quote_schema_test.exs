defmodule Gas.QuoteSchemaTest do
  use Gas.DataCase

  alias GasWeb.Schema
  alias Gas.MapHelpers
  alias GasWeb.QuoteQueries, as: Queries

  describe "mutation" do
    test "create quote succeeds" do
      %{
        id: source_id,
        author: author
      } = source = insert(:source)

      source_id = Integer.to_string(source_id)

      tags =
        insert_list(2, :tag)
        |> Enum.map(&Integer.to_string(&1.id))

      quote_ =
        params_for(:quote, source: source)
        |> MapHelpers.stringify_keys()
        |> Map.merge(%{"sourceId" => source_id, "tags" => tags})

      variables = %{"quote" => quote_}

      assert {:ok,
              %{
                data: %{
                  "createQuote" => %{
                    "source" => %{
                      "id" => ^source_id,
                      "author" => ^author
                    }
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:create_quote),
                 Schema,
                 variables: variables
               )
    end
  end
end
