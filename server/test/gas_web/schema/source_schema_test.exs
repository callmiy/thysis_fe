defmodule GasWeb.SourceSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.SourceQueries, as: Queries
  alias Gas.Source
  alias Gas.MapHelpers
  alias Gas.SourceApi

  # @tag :norun
  describe "query" do
    # @tag :norun
    test "get all sources succeeds" do
      # first source
      SourceFactory.insert()

      # 2nd source

      __source =
        %Source{
          id: id,
          source_type_id: source_type_id
        } = SourceFactory.insert()

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
               "display" => display,
               "sourceType" => %{
                 "id" => ^source_type_id
               },
               "authors" => authors_
             } = List.last(sources)

      assert_display(authors_, display)
    end

    # @tag :norun
    test "get one source succeeds" do
      %Source{
        id: id,
        source_type_id: source_type_id,
        year: year
      } = SourceFactory.insert()

      id = Integer.to_string(id)
      source_type_id = inspect(source_type_id)

      assert {:ok,
              %{
                data: %{
                  "source" => %{
                    "id" => ^id,
                    "year" => ^year,
                    "display" => display,
                    "sourceType" => %{
                      "id" => ^source_type_id
                    },
                    "authors" => authors_
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

      assert_display(authors_, display)
    end
  end

  # @tag :norun
  describe "create mutatation" do
    # @tag :norun
    test "create source with author names only" do
      %{id: source_type_id, name: name} = source_type = insert(:source_type)

      source_type_id = Integer.to_string(source_type_id)

      %{year: year} =
        source =
        SourceFactory.params_for(
          :with_authors,
          source_type: source_type,
          year: "2016"
        )

      {authors, source_input} = make_authors(source)

      variables = %{
        "source" => source_input
      }

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "id" => _,
                    "year" => ^year,
                    "display" => display,
                    "sourceType" => %{
                      "id" => ^source_type_id,
                      "name" => ^name
                    },
                    "authors" => authors_
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:source),
                 Schema,
                 variables: variables
               )

      assert_display(authors_, display)
      assert_authors(authors, authors_)
    end

    # @tag :norun
    test "create source without author names or IDs errors" do
      {_, source} =
        SourceFactory.params_with_assocs()
        |> make_authors()

      variables = %{"source" => source}

      error = "{name: source, error: [authors: #{SourceApi.author_required_error_string()}]}"

      assert {:ok,
              %{
                data: %{
                  "createSource" => nil
                },
                errors: [
                  %{
                    message: ^error,
                    path: ["createSource"]
                  }
                ]
              }} =
               Absinthe.run(
                 Queries.mutation(:source),
                 Schema,
                 variables: variables
               )
    end

    # @tag :norun
    test "create source does not insert duplicate author IDs" do
      id = insert(:author).id

      author_attrs =
        build_list(3, :author)
        |> Enum.map(&%{name: &1.name})

      source =
        SourceFactory.params_with_assocs(
          :with_authors,
          author_ids: [id, id],
          author_attrs: author_attrs
        )

      {_authors, source_input} = make_authors(source)

      variables = %{
        "source" => source_input
      }

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "authors" => authors
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:source),
                 Schema,
                 variables: variables
               )

      assert length(authors) == 4
    end

    # @tag :norun
    test "create source with invalid author IDs errors" do
      id = insert(:author).id

      {_, source} =
        SourceFactory.params_with_assocs(nil, author_ids: [id, id + 1])
        |> make_authors()

      variables = %{"source" => source}

      error =
        "{name: source, error: [author_ids: #{SourceApi.invalid_ids_error_string([id + 1])}]}"

      assert {:ok,
              %{
                data: %{
                  "createSource" => nil
                },
                errors: [
                  %{
                    message: ^error,
                    path: ["createSource"]
                  }
                ]
              }} =
               Absinthe.run(
                 Queries.mutation(:source),
                 Schema,
                 variables: variables
               )
    end
  end

  # @tag :norun
  describe "update mutatation" do
    test "update source with author ids succeeds" do
      %{authors: authors, id: id} = SourceFactory.insert()
      id = Integer.to_string(id)

      ids =
        insert_list(Faker.random_between(1, 3), :author)
        |> Enum.map(&Integer.to_string(&1.id))

      variables = %{
        "source" => %{
          "id" => id,
          "author_ids" => ids
        }
      }

      assert {:ok,
              %{
                data: %{
                  "updateSource" => %{
                    "id" => ^id,
                    "authors" => authors_graphQl
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:update_source),
                 Schema,
                 variables: variables
               )

      assert length(authors_graphQl) == length(authors) + length(ids)
      authors_graphQl = Enum.map(authors_graphQl, & &1["id"])
      assert Enum.all?(ids, &Enum.member?(authors_graphQl, &1))
    end

    test "update source with author attrs succeeds" do
      %{authors: authors, id: id} = SourceFactory.insert()
      id = Integer.to_string(id)

      author_attrs =
        build_list(Faker.random_between(1, 3), :author)
        |> Enum.map(fn %{name: name} ->
          %{"name" => name}
        end)

      variables = %{
        "source" => %{
          "id" => id,
          "author_attrs" => author_attrs
        }
      }

      assert {:ok,
              %{
                data: %{
                  "updateSource" => %{
                    "id" => ^id,
                    "authors" => authors_graphQl
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:update_source),
                 Schema,
                 variables: variables
               )

      assert length(authors_graphQl) == length(authors) + length(author_attrs)
      authors_graphQl = Enum.map(authors_graphQl, & &1["name"])
      assert Enum.all?(author_attrs, &Enum.member?(authors_graphQl, &1["name"]))
    end

    test "update source without author attrs and ids succeeds" do
      %{authors: authors, id: id} = source = SourceFactory.insert()
      id = Integer.to_string(id)

      attrs =
        SourceFactory.params()
        |> MapHelpers.stringify_keys()

      variables = %{
        "source" => Map.merge(attrs, %{"id" => id})
      }

      assert {:ok,
              %{
                data: %{
                  "updateSource" =>
                    %{
                      "id" => ^id,
                      "authors" => authors_graphQl
                    } = source_graphQl
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:update_source),
                 Schema,
                 variables: variables
               )

      assert length(authors_graphQl) == length(authors)

      assert Enum.all?(attrs, fn {key, val} ->
               key_ = String.to_existing_atom(key)
               source_graphQl[key] == val && Map.get(source, key_) != val
             end)
    end
  end

  defp assert_authors(authors, authors_graphql) do
    authors_length =
      Map.values(authors)
      |> Enum.concat()
      |> length()

    assert authors_length == length(authors_graphql)

    case Map.get(authors, "author_ids") do
      nil ->
        :ok

      author_ids ->
        ids = Enum.map(authors_graphql, & &1["id"])
        assert Enum.all?(author_ids, &Enum.member?(ids, &1))
    end

    case Map.get(authors, "author_attrs") do
      nil ->
        :ok

      author_attrs ->
        author_attrs = Enum.map(author_attrs, & &1["name"])
        names = Enum.map(authors_graphql, & &1["name"])
        assert Enum.all?(author_attrs, &Enum.member?(names, &1))
    end
  end

  defp assert_display(authors, display),
    do: assert(Enum.all?(authors, &String.contains?(display, &1["name"])))

  defp make_authors(source) do
    {authors, source} =
      case Map.pop(source, :author_ids) do
        {nil, source} ->
          {%{}, source}

        {author_ids, source} ->
          author_ids = Enum.map(author_ids, &Integer.to_string/1)
          {%{"author_ids" => author_ids}, source}
      end

    {authors, source} =
      case {author_attrs, source} = Map.pop(source, :author_attrs) do
        {nil, source} ->
          {authors, source}

        {author_attrs, source} ->
          author_attrs = Enum.map(author_attrs, &MapHelpers.stringify_keys/1)
          {Map.merge(authors, %{"author_attrs" => author_attrs}), source}
      end

    source =
      source
      |> MapHelpers.stringify_keys()
      |> Map.merge(%{
        "sourceTypeId" => Integer.to_string(source.source_type_id)
      })

    {authors, Map.merge(source, authors)}
  end
end
