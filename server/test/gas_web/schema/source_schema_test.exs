defmodule ThisesWeb.SourceSchemaTest do
  use Thises.DataCase
  alias ThisesWeb.Schema
  alias ThisesWeb.Query.Source, as: Query
  alias Thises.Sources.Source
  alias Thises.Sources
  alias Thises.Factory.Author, as: AuthorFactory
  alias Thises.Factory.Registration, as: RegFactory
  alias Thises.Factory.Project, as: ProjectFactory
  alias Thises.Factory.Source, as: Factory
  alias Thises.Factory.SourceType, as: SourceTypeFactory

  describe "query" do
    # @tag :skip
    test "get all sources for project does not get other projects succeeds" do
      user = RegFactory.insert()

      # first source belonging to random project of same user
      Factory.insert(project: ProjectFactory.insert(user: user))

      project = ProjectFactory.insert(user: user)

      # 2nd source

      %Source{
        id: id1
      } = Factory.insert(project: project)

      %Source{
        id: id2
      } = Factory.insert(project: project)

      ids =
        [id1, id2]
        |> Enum.map(&to_string/1)
        |> Enum.sort()

      queryMap = Query.sources()

      query = """
        query GetAllProjectsForUser(#{queryMap.params}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "sources" => sources
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{"source" => %{"projectId" => project.id}},
                 context: %{current_user: user}
               )

      assert length(sources) == 2
      assert ids == sources |> Enum.map(& &1["id"]) |> Enum.sort()
    end

    # @tag :skip
    test "get all sources for user succeeds" do
      user = RegFactory.insert()

      # first source belonging to random project of same user
      Factory.insert(project: ProjectFactory.insert(user: user))

      project = ProjectFactory.insert(user: user)

      # 2nd and 3rd source
      Factory.insert(project: project)
      Factory.insert(project: project)

      queryMap = Query.sources()

      query = """
        query GetAllProjectsForUser(#{queryMap.params}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "sources" => sources
                }
              }} =
               Absinthe.run(query, Schema,
                 #  variables: %{"source" => %{"projectId" => project.id}},
                 context: %{current_user: user}
               )

      assert length(sources) == 3
    end

    # @tag :skip
    test "get one source succeeds for right owner of source" do
      user = RegFactory.insert()

      %Source{
        id: id,
        year: year
      } = Factory.insert(project: ProjectFactory.insert(user: user))

      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "source" => %{
                    "id" => ^id,
                    "year" => ^year,
                    "sourceType" => %{
                      "id" => _source_type_id
                    },
                    "authors" => _
                  }
                }
              }} =
               Absinthe.run(
                 Query.query(:source),
                 Schema,
                 variables: %{
                   "source" => %{
                     "id" => id
                   }
                 },
                 context: %{current_user: user}
               )
    end

    # @tag :skip
    test "get one source fails for wrong owner of source" do
      user = RegFactory.insert()

      # source does not belong to user
      source = Factory.insert()

      assert {:ok,
              %{
                errors: [
                  %{
                    message: message
                  }
                ]
              }} =
               Absinthe.run(
                 Query.query(:source),
                 Schema,
                 variables: %{
                   "source" => %{
                     "id" => source.id
                   }
                 },
                 context: %{current_user: user}
               )

      assert message =~ "unauthorized"
    end
  end

  describe "create mutation" do
    # @tag :skip
    test "create source with author names only" do
      user = RegFactory.insert()
      %{id: source_type_id, name: name} = SourceTypeFactory.insert(user: user)

      source =
        Factory.params(
          project_id: ProjectFactory.insert(user: user).id,
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
                 Query.mutation(:source),
                 Schema,
                 variables: %{
                   "source" => Factory.stringify(source)
                 },
                 context: %{current_user: user}
               )

      assert_authors(source, authors_)
    end

    # @tag :skip
    test "create source without author names or IDs errors" do
      error =
        ~s|{"name":"source","error":{"authors":"#{Sources.author_required_error_string()}"}}|

      user = RegFactory.insert()
      source_type = SourceTypeFactory.insert(user: user)

      source =
        Factory.params_no_authors(
          source_type_id: source_type.id,
          project_id: ProjectFactory.insert(user: user).id
        )
        |> Factory.stringify()

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
                 Query.mutation(:source),
                 Schema,
                 variables: %{
                   "source" => source
                 },
                 context: %{current_user: user}
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
        Factory.params_no_authors(%{
          source_type_id: insert(:source_type).id
        })
        |> Map.merge(%{
          # 2 author ids
          author_ids: [id, id],
          # 3 author attrs
          author_attrs: author_attrs
        })
        |> Factory.stringify()

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "authors" => authors
                  }
                }
              }} =
               Absinthe.run(
                 Query.mutation(:source),
                 Schema,
                 variables: %{
                   "source" => source
                 }
               )

      assert length(authors) == 4
    end

    @tag :skip
    test "create source with invalid author IDs errors" do
      id = AuthorFactory.insert().id

      source =
        Factory.params_no_authors(%{
          source_type_id: insert(:source_type).id
        })
        |> Map.merge(%{author_ids: [id, id + 1]})
        |> Factory.stringify()

      error = "{name: source, error: [author_ids: #{Sources.invalid_ids_error_string([id + 1])}]}"

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
                 Query.mutation(:source),
                 Schema,
                 variables: %{"source" => source}
               )
    end
  end

  describe "update mutation" do
    @tag :skip
    test "update source with author ids succeeds" do
      %{authors: authors, id: id} = Factory.insert()
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
                 Query.mutation(:update_source),
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

    @tag :skip
    test "update source with author attrs succeeds" do
      %{authors: authors, id: id} = Factory.insert()
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
                 Query.mutation(:update_source),
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

    @tag :skip
    test "update source without author attrs and author ids succeeds" do
      %{authors: authors, id: id} = source = Factory.insert()
      id = Integer.to_string(id)

      attrs =
        Factory.params_no_authors()
        |> Enum.reject(fn {k, v} -> Map.get(source, k) == v end)
        |> Enum.into(%{})
        |> Factory.stringify()
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
                 Query.mutation(:update_source),
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
        |> Factory.stringify()

      assert Enum.all?(attrs, fn {key, val} ->
               source_graphQl[key] == val && Map.get(source_stringified, key) != val
             end)
    end

    @tag :skip
    test "update source with deleted authors succeeds" do
      author_ids =
        AuthorFactory.insert_list(3)
        |> Enum.map(&Integer.to_string(&1.id))

      taken = Enum.take(author_ids, 2)

      %{id: id} =
        Factory.insert(
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
                 Query.mutation(:update_source),
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
