defmodule Gas.QuoteSchemaTest do
  use Gas.DataCase

  alias GasWeb.Schema
  alias Gas.MapHelpers
  alias GasWeb.Query.Quote, as: QuoteQuery, as: Queries
  alias Gas.Factory.Source, as: SourceFactory

  # @tag :skip
  describe "mutation" do
    test "create quote succeeds" do
      %{
        id: source_id
      } = source = SourceFactory.insert()

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
                      "id" => ^source_id
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

  # @tag :skip
  describe "query" do
    # @tag :skip
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

    # @tag :skip
    test "get quotes by source id succeeds" do
      [source1, source2] = SourceFactory.insert_list(2)
      %{id: source1_quote_id} = insert(:quote, source: source1)

      source2_id = Integer.to_string(source2.id)

      raw_quotes_id =
        insert_list(2, :quote, source: source2)
        |> Enum.map(&Integer.to_string(&1.id))
        |> Enum.sort()

      variables = %{
        "quote" => %{
          "source" => source2_id
        }
      }

      assert {:ok,
              %{
                data: %{
                  "quotes" =>
                    [
                      %{
                        "source" => %{
                          "id" => ^source2_id,
                          "authors" => graphQl_authors
                        }
                      },
                      _
                    ] = quotes
                }
              }} =
               Absinthe.run(
                 Queries.query(:quotes),
                 Schema,
                 variables: variables
               )

      {ids, names} =
        Enum.reduce(source2.authors, {[], []}, fn %{id: id, name: name}, {ids, names} ->
          {
            [Integer.to_string(id) | ids],
            [name | names]
          }
        end)

      {graphQl_ids, graphQl_names} =
        Enum.reduce(graphQl_authors, {[], []}, fn %{"id" => id, "name" => name}, {ids, names} ->
          {
            [id | ids],
            [name | names]
          }
        end)

      assert Enum.sort(ids) == Enum.sort(graphQl_ids)
      assert Enum.sort(names) == Enum.sort(graphQl_names)

      quotes_ids = Enum.map(quotes, & &1["id"]) |> Enum.sort()

      assert raw_quotes_id == quotes_ids
      refute Enum.member?(quotes_ids, Integer.to_string(source1_quote_id))
    end

    test "get a quote by id succeeds for existing quote" do
      %{id: id} = insert(:quote)
      id_binary = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "quote" => %{
                    "id" => ^id_binary
                  }
                }
              }} =
               Absinthe.run(
                 Queries.get_quote(),
                 Schema,
                 variables: %{
                   "quote" => %{
                     "id" => id_binary
                   }
                 }
               )
    end
  end

  # @tag :skip
  describe "full text search" do
    test "full text search across source_types table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:source_type, name: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "sourceTypes" => [
                      %{
                        "tid" => ^id,
                        "source" => "SOURCE_TYPES",
                        "text" => ^search_text,
                        "column" => "name"
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
      %{id: id} = SourceFactory.insert(topic: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "sources" => [
                      %{
                        "tid" => ^id,
                        "source" => "SOURCES",
                        "text" => ^search_text,
                        "column" => "topic"
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
                        "tid" => ^id,
                        "source" => "TAGS",
                        "text" => ^search_text,
                        "column" => "text"
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
                        "tid" => ^id,
                        "source" => "QUOTES",
                        "text" => ^search_text,
                        "column" => "text"
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
                        "tid" => ^qid,
                        "source" => "QUOTES",
                        "text" => ^search_text
                      }
                    ],
                    "tags" => [
                      %{
                        "tid" => ^tid,
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

    test "full text search across authors table" do
      search_text = Faker.String.base64(4)
      %{id: id} = insert(:author, name: search_text)

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "authors" => [
                      %{
                        "tid" => ^id,
                        "source" => "AUTHORS",
                        "text" => ^search_text,
                        "column" => "name"
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
