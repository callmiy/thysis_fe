defmodule GasWeb.TagSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.TagQueries, as: Queries
  alias Gas.Tag
  # alias Gas.MapHelpers

  describe "query" do
    test "get tag by id" do
      %Tag{id: id} = insert(:tag)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "tag" => %{
                    "id" => ^id,
                    "text" => _,
                    "question" => _,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "id" => id
                   }
                 }
               )
    end

    test "get tag by text" do
      %Tag{text: text} = insert(:tag)

      assert {:ok,
              %{
                data: %{
                  "tag" => %{
                    "id" => _,
                    "text" => ^text,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "text" => text
                   }
                 }
               )
    end

    test "get tag by id and text" do
      %Tag{id: id, text: text} = insert(:tag)
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "tag" => %{
                    "id" => ^id,
                    "text" => ^text,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 Queries.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "id" => id,
                     "text" => text
                   }
                 }
               )
    end

    test "get all tags succeeds" do
      # first tag
      insert(:tag)

      # 2nd tag
      %{text: text, id: id} = insert(:tag)
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "tags" => tags
                }
              }} = Absinthe.run(Queries.query(:tags), Schema)

      assert length(tags) == 2
      assert %{"id" => ^id, "text" => ^text} = List.last(tags)
    end
  end

  describe "mutation" do
    test "create tag succeeds" do
      text = "Awesome tag"

      assert {:ok,
              %{
                data: %{
                  "createTag" => %{
                    "id" => _,
                    "text" => ^text
                  }
                }
              }} =
               Absinthe.run(
                 Queries.mutation(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "text" => text
                   }
                 }
               )
    end
  end
end
