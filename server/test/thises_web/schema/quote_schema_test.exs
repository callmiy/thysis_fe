defmodule Thysis.QuoteSchemaTest do
  use Thysis.DataCase

  alias ThysisWeb.Schema
  alias ThysisWeb.Query.Quote, as: Query
  alias Thysis.Factory.Source, as: SourceFactory
  alias Thysis.Factory.Quote, as: Factory
  alias Thysis.Factory.SourceType, as: SourceTypeFactory
  alias Thysis.Factory.Tag, as: TagFactory
  alias Thysis.Factory.Author, as: AuthorFactory

  describe "mutation" do
    # @tag :skip
    test "create quote succeeds" do
      {assoc, assoc_ids} = SourceFactory.assoc()

      %{
        id: source_id
      } = _source = SourceFactory.insert(assoc_ids)

      quote_ =
        Factory.params(source_id: source_id)
        |> Factory.stringify()

      source_id = Integer.to_string(source_id)

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
                 Query.mutation(:create_quote),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end
  end

  describe "query" do
    # @tag :skip
    test "get all quotes with no variables succeeds" do
      {assoc, assoc_ids} = SourceFactory.assoc()
      Factory.insert_list(3, source_id: SourceFactory.insert(assoc_ids).id)

      assert {:ok,
              %{
                data: %{
                  "quotes" => quotes
                }
              }} =
               Absinthe.run(
                 Query.query(:quotes),
                 Schema,
                 context: context(assoc.user)
               )

      assert length(quotes) == 3
    end

    # @tag :skip
    test "get quotes by source id succeeds" do
      {assoc, assoc_ids} = SourceFactory.assoc()
      [source1, source2] = SourceFactory.insert_list(2, assoc_ids)
      %{id: source1_quote_id} = Factory.insert(source_id: source1.id)

      source2_id = Integer.to_string(source2.id)

      raw_quotes_id =
        Factory.insert_list(2, source_id: source2.id)
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
                 Query.query(:quotes),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )

      {ids, names} =
        Enum.reduce(
          source2.authors,
          {[], []},
          fn %{id: id, last_name: name}, {ids, names} ->
            {
              [Integer.to_string(id) | ids],
              [name | names]
            }
          end
        )

      {graphQl_ids, graphQl_names} =
        Enum.reduce(
          graphQl_authors,
          {[], []},
          fn %{"id" => id, "lastName" => name}, {ids, names} ->
            {
              [id | ids],
              [name | names]
            }
          end
        )

      assert Enum.sort(ids) == Enum.sort(graphQl_ids)
      assert Enum.sort(names) == Enum.sort(graphQl_names)

      quotes_ids = Enum.map(quotes, & &1["id"]) |> Enum.sort()

      assert raw_quotes_id == quotes_ids
      refute Enum.member?(quotes_ids, Integer.to_string(source1_quote_id))
    end

    # @tag :skip
    test "get a quote by id succeeds for existing quote" do
      {assoc, assoc_ids} = SourceFactory.assoc()
      %{id: id} = Factory.insert(source_id: SourceFactory.insert(assoc_ids).id)
      id_binary = Integer.to_string(id)

      variables = %{
        "quote" => %{
          "id" => id_binary
        }
      }

      assert {:ok,
              %{
                data: %{
                  "quote" => %{
                    "id" => ^id_binary
                  }
                }
              }} =
               Absinthe.run(
                 Query.get_quote(),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end
  end

  describe "full text search" do
    # @tag :skip
    test "full text search across source_types table" do
      search_text = Faker.String.base64(4)
      {assoc, _assoc_ids} = SourceFactory.assoc()

      %{id: id} =
        SourceTypeFactory.insert(
          user_id: assoc.user.id,
          name: search_text
        )

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
                 Query.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 },
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "full text search across sources table" do
      search_text = Faker.String.base64(4)
      {assoc, assoc_ids} = SourceFactory.assoc()
      %{id: id} = SourceFactory.insert(Map.put(assoc_ids, :topic, search_text))

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
                 Query.query(:full_text_search),
                 Schema,
                 variables: %{
                   "text" => %{
                     "text" => search_text
                   }
                 },
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "full text search across tags table" do
      {assoc, _assoc_ids} = SourceFactory.assoc()
      search_text = Faker.String.base64(4)
      %{id: id} = TagFactory.insert(text: search_text)

      variables = %{
        "text" => %{
          "text" => search_text
        }
      }

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
                 Query.query(:full_text_search),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "full text search across quotes table" do
      {assoc, assoc_ids} = SourceFactory.assoc()
      search_text = Faker.String.base64(4)

      %{id: id} =
        Factory.insert(
          text: search_text,
          source_id: SourceFactory.insert(assoc_ids).id
        )

      variables = %{
        "text" => %{
          "text" => search_text
        }
      }

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
                 Query.query(:full_text_search),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "full text search across quotes and tag tables case insensitive" do
      {assoc, assoc_ids} = SourceFactory.assoc()
      search_text = Faker.String.base64(4)

      %{id: qid} =
        Factory.insert(
          text: search_text,
          source_id: SourceFactory.insert(assoc_ids).id
        )

      search_text_ = String.upcase(search_text)
      %{id: tid} = TagFactory.insert(text: search_text_)

      variables = %{
        "text" => %{
          "text" => search_text
        }
      }

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
                 Query.query(:full_text_search),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end

    # @tag :skip
    test "full text search across authors table" do
      {assoc, _assoc_ids} = SourceFactory.assoc()
      search_text = Faker.Name.last_name()
      first_name = Faker.Name.first_name()

      middle_names =
        [
          Faker.String.base64(3),
          Faker.String.base64(2)
        ]
        |> Enum.map(&String.capitalize/1)
        |> Enum.join(" ")

      full_name = ~s(#{search_text} #{first_name} #{middle_names})

      %{id: id} =
        AuthorFactory.insert(
          last_name: search_text,
          first_name: first_name,
          middle_name: middle_names,
          user_id: assoc.user.id,
          project_id: assoc.project.id
        )

      variables = %{
        "text" => %{
          "text" => search_text
        }
      }

      assert {:ok,
              %{
                data: %{
                  "quoteFullSearch" => %{
                    "authors" => [
                      %{
                        "tid" => ^id,
                        "source" => "AUTHORS",
                        "text" => ^full_name,
                        "column" => "full_name"
                      }
                    ]
                  }
                }
              }} =
               Absinthe.run(
                 Query.query(:full_text_search),
                 Schema,
                 variables: variables,
                 context: context(assoc.user)
               )
    end
  end

  defp context(user) do
    %{current_user: user}
  end
end
