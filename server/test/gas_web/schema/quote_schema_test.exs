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

  describe "query" do
    test "get all quotes with no variables succeeds" do
      insert_list(3, :quote)

      assert {:ok,
              %{
                data: %{
                  "quotes" => quotes
                }
              }} =
               Absinthe.run(
                 Queries.query(:quotes),
                 Schema
               )

      assert length(quotes) == 3
    end

    test "get quotes by source id succeeds" do
      [source1, source2] = insert_list(2, :source)
      %{id: source1_quote_id} = insert(:quote, source: source1)

      source2_id = Integer.to_string(source2.id)

      raw_quotes_id =
        insert_list(2, :quote, source: source2)
        |> Enum.map(&Integer.to_string(&1.id))
        |> Enum.sort()

      assert {:ok,
              %{
                data: %{
                  "quotes" =>
                    [
                      %{
                        "source" => %{
                          "id" => ^source2_id
                        }
                      },
                      _
                    ] = quotes
                }
              }} =
               Absinthe.run(
                 Queries.query(:quotes),
                 Schema,
                 variables: %{
                   "quote" => %{
                     "source" => source2_id
                   }
                 }
               )

      quotes_ids = Enum.map(quotes, & &1["id"]) |> Enum.sort()
      assert raw_quotes_id == quotes_ids
      refute Enum.member?(quotes_ids, Integer.to_string(source1_quote_id))
    end

    test "full text search across source_types table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:source_type, name: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "sourceTypes" => [
                      %{
                        "id" => ^id,
                        "source" => "SOURCE_TYPES",
                        "text" => ^search_text
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 }
               )
    end

    test "full text search across sources table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:source, author: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "sources" => [
                      %{
                        "id" => ^id,
                        "source" => "SOURCES",
                        "text" => ^search_text
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 }
               )
    end

    test "full text search across tags table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:tag, text: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "tags" => [
                      %{
                        "id" => ^id,
                        "source" => "TAGS",
                        "text" => ^search_text
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 }
               )
    end

    test "full text search across quotes table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:quote, text: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "quotes" => [
                      %{
                        "id" => ^id,
                        "source" => "QUOTES",
                        "text" => ^search_text
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 }
               )
    end

    test "full text search across quotes and tag tables case insensitive" do
      search_text = Faker.String.base64(4)
      %{id: qid} = insert(:quote, text: search_text)

      search_text_ = String.upcase(search_text)
      %{id: tid} = insert(:tag, text: search_text_)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "quotes" => [
                      %{
                        "id" => ^qid,
                        "source" => "QUOTES",
                        "text" => ^search_text
                      }
                    ],
                    "tags" => [
                      %{
                        "id" => ^tid,
                        "source" => "TAGS",
                        "text" => ^search_text_
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 }
               )
    end
  end
end
