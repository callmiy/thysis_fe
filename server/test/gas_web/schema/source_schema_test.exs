defmodule GasWeb.SourceSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.Query.Source, as: SourceQuery, as: Queries
  alias Gas.Source
  alias Gas.MapHelpers
  alias Gas.SourceApi
  alias Gas.Factory.Author, as: AuthorFactory

  # @tag :skip
  describe "query" do
    # @tag :skip
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
               "sourceType" => %{
                 "id" => ^source_type_id
               },
               "authors" => authors_
             } = List.last(sources)
    end

    # @tag :skip
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
                    "sourceType" => %{
                      "id" => ^source_type_id
                    },
                    "authors" => _
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
    end
  end

  describe "create mutation" do
    # @tag :skip
    test "create source with author names only" do
      %{id: source_type_id, name: name} = insert(:source_type)

      source =
        SourceFactory.params(
          source_type_id: source_type_id,
          year: "2016"
        )

      source_type_id = Integer.to_string(source_type_id)

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "id" => _,
                    "year" => "2016",
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
                 variables: %{
                   "source" => SourceFactory.stringify(source)
                 }
               )

      assert_authors(source, authors_)
    end

    # @tag :skip
    test "create source without author names or IDs errors" do
      error = "{name: source, error: [authors: #{SourceApi.author_required_error_string()}]}"

      source_type = insert(:source_type)

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
                 variables: %{
                   "source" =>
                     SourceFactory.params_no_authors(%{
                       source_type_id: source_type.id
                     })
                     |> SourceFactory.stringify()
                 }
               )
    end

    # @tag :skip
    test "create source does not insert duplicate author IDs" do
      id = AuthorFactory.insert().id

      author_attrs =
        3
        |> AuthorFactory.params_list()
        |> Enum.map(&%{last_name: &1.last_name})

      source =
        SourceFactory.params_no_authors(%{
          source_type_id: insert(:source_type).id
        })
        |> Map.merge(%{
          # 2 author ids
          author_ids: [id, id],
          # 3 author attrs
          author_attrs: author_attrs
        })
        |> SourceFactory.stringify()

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
                 variables: %{
                   "source" => source
                 }
               )

      assert length(authors) == 4
    end

    # @tag :skip
    test "create source with invalid author IDs errors" do
      id = AuthorFactory.insert().id

      source =
        SourceFactory.params_no_authors(%{
          source_type_id: insert(:source_type).id
        })
        |> Map.merge(%{author_ids: [id, id + 1]})
        |> SourceFactory.stringify()

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
                 variables: %{"source" => source}
               )
    end
  end

  describe "update mutation" do
    # @tag :skip
    test "update source with author ids succeeds" do
      %{authors: authors, id: id} = SourceFactory.insert()
      id = Integer.to_string(id)

      ids =
        1..3
        |> Enum.random()
        |> AuthorFactory.insert_list()
        |> Enum.map(&Integer.to_string(&1.id))

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
                 variables: %{
                   "source" => %{
                     "id" => id,
                     "author_ids" => ids
                   }
                 }
               )

      assert length(authors_graphQl) == length(authors) + length(ids)
      authors_graphQl_ids = Enum.map(authors_graphQl, & &1["id"])
      assert Enum.all?(ids, &Enum.member?(authors_graphQl_ids, &1))
    end

    # @tag :skip
    test "update source with author attrs succeeds" do
      %{authors: authors, id: id} = SourceFactory.insert()
      id = Integer.to_string(id)

      author_attrs =
        1..3
        |> Enum.random()
        |> AuthorFactory.insert_list()
        |> Enum.map(fn a ->
          %{"lastName" => a.last_name}
        end)

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
                 variables: %{
                   "source" => %{
                     "id" => id,
                     "author_attrs" => author_attrs
                   }
                 }
               )

      assert length(authors_graphQl) == length(authors) + length(author_attrs)
      authors_graphQl_names = Enum.map(authors_graphQl, & &1["lastName"])

      assert Enum.all?(
               author_attrs,
               &Enum.member?(authors_graphQl_names, &1["lastName"])
             )
    end

    # @tag :skip
    test "update source without author attrs and author ids succeeds" do
      %{authors: authors, id: id} = source = SourceFactory.insert()
      id = Integer.to_string(id)

      attrs =
        SourceFactory.params_no_authors()
        |> Enum.reject(fn {k, v} -> Map.get(source, k) == v end)
        |> Enum.into(%{})
        |> SourceFactory.stringify()
        |> Map.drop(["sourceType", "sourceTypeId"])

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
                 variables: %{
                   "source" => attrs |> Map.merge(%{"id" => id})
                 }
               )

      assert length(authors_graphQl) == length(authors)

      source_stringified =
        source
        |> Map.from_struct()
        |> Map.drop([:author_ids, :author_attrs])
        |> SourceFactory.stringify()

      assert Enum.all?(attrs, fn {key, val} ->
               source_graphQl[key] == val && Map.get(source_stringified, key) != val
             end)
    end

    # @tag :skip
    test "update source with deleted authors succeeds" do
      author_ids =
        AuthorFactory.insert_list(3)
        |> Enum.map(&Integer.to_string(&1.id))

      taken = Enum.take(author_ids, 2)

      %{id: id} =
        SourceFactory.insert(
          author_ids: author_ids,
          author_attrs: nil
        )

      id = Integer.to_string(id)

      variables = %{
        "source" => %{
          "id" => id,
          "deleted_authors" => taken
        }
      }

      assert {:ok,
              %{
                data: %{
                  "updateSource" => %{
                    "id" => ^id,
                    "authors" => [author_graphQl]
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:update_source),
                 Schema,
                 variables: variables
               )

      refute Enum.member?(taken, author_graphQl["id"])
    end
  end

  defp assert_authors(%{} = source, authors_graphql) do
    authors =
      source
      |> Map.take([:author_ids, :author_attrs])
      |> Map.values()
      |> Enum.reject(&(&1 == nil))
      |> Enum.concat()

    authors_length = length(authors)

    assert authors_length == length(authors_graphql)

    case Map.get(source, :author_ids) do
      nil ->
        :ok

      author_ids ->
        all_ids = Enum.map(authors_graphql, & &1["id"])
        author_ids = Enum.map(author_ids, &Integer.to_string/1)
        assert Enum.all?(author_ids, &Enum.member?(all_ids, &1))
    end

    case Map.get(source, :author_attrs) do
      nil ->
        :ok

      author_attrs ->
        author_attrs = Enum.map(author_attrs, & &1.last_name)
        names = Enum.map(authors_graphql, & &1["lastName"])
        assert Enum.all?(author_attrs, &Enum.member?(names, &1))
    end
  end
end
