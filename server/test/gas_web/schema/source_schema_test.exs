defmodule GasWeb.SourceSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.SourceQueries, as: Queries
  alias Gas.Source
  alias Gas.MapHelpers

  describe "query" do
    test "get all sources succeeds" do
      # first source
      SourceFactory.insert(:source)

      # 2nd source
      %Source{
        id: id,
        source_type_id: source_type_id
      } = SourceFactory.insert(:source)

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
               "display" => _display,
               "sourceType" => %{
                 "id" => ^source_type_id
               }
             } = List.last(sources)
    end

    test "get one source succeeds" do
      %Source{
        id: id,
        source_type_id: source_type_id,
        year: year
      } = SourceFactory.insert(:source)

      id = Integer.to_string(id)
      source_type_id = inspect(source_type_id)

      assert {:ok,
              %{
                data: %{
                  "source" => %{
                    "id" => ^id,
                    "year" => ^year,
                    "display" => _display,
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
    end
  end

  describe "mutatation" do
    test "create source with author names only" do
      %{id: source_type_id, name: name} = source_type = insert(:source_type)

      source_type_id = Integer.to_string(source_type_id)

      %{year: year} =
        source =
        SourceFactory.params_for(
          :source,
          source_type: source_type,
          year: "2016"
        )

      {authors, count, source_input} = make_authors(source)

      variables = %{
        "source" => source_input
      }

      assert {:ok,
              %{
                data: %{
                  "createSource" => %{
                    "id" => _,
                    "year" => ^year,
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

      assert length(authors_) == count
      assert_authors(authors, authors_)
    end

    test "create source without author names or IDs errors" do
      source =
        SourceFactory.params_with_assocs(
          :source,
          author_ids: nil,
          author_maps: nil
        )
        |> MapHelpers.stringify_keys()

      variables = %{
        "source" => %{
          "source" => source
        }
      }

      assert {:ok,
              %{
                data: %{
                  "createSource" => nil
                },
                errors: [
                  %{
                    message: "You must specify at least one author",
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

  defp assert_authors(authors, authors_graphql) do
    case Map.get(authors, "author_ids") do
      nil ->
        :ok

      author_ids ->
        ids = Enum.map(authors_graphql, & &1["id"])
        assert Enum.all?(author_ids, &Enum.member?(ids, &1))
    end

    case Map.get(authors, "author_maps") do
      nil ->
        :ok

      author_maps ->
        author_maps = Enum.map(author_maps, & &1["name"])
        names = Enum.map(authors_graphql, & &1["name"])
        assert Enum.all?(author_maps, &Enum.member?(names, &1))
    end
  end

  defp make_authors(source) do
    authors = %{}
    count = 0

    {authors, count, source} =
      case Map.pop(source, :author_ids) do
        {nil, source} ->
          {authors, count, source}

        {author_ids, source} ->
          author_ids = Enum.map(author_ids, &Integer.to_string/1)

          {
            Map.merge(authors, %{"author_ids" => author_ids}),
            count + length(author_ids),
            source
          }
      end

    {authors, count, source} =
      case {author_maps, source} = Map.pop(source, :author_maps) do
        {nil, source} ->
          {authors, count, source}

        {author_maps, source} ->
          author_maps = Enum.map(author_maps, &MapHelpers.stringify_keys/1)

          {
            Map.merge(authors, %{"author_maps" => author_maps}),
            count + length(author_maps),
            source
          }
      end

    source_type_id = Integer.to_string(source.source_type_id)

    source =
      source
      |> MapHelpers.stringify_keys()
      |> Map.merge(%{
        "sourceTypeId" => source_type_id
      })

    source_input =
      if authors == %{} do
        %{"source" => source}
      else
        Map.merge(%{"source" => source}, authors)
      end

    {authors, count, source_input}
  end
end
