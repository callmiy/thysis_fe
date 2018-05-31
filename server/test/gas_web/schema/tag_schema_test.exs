defmodule GasWeb.TagSchemaTest do
  use Gas.DataCase
  alias GasWeb.Schema
  alias GasWeb.TagQueries
  alias Gas.Tag
  # alias Gas.MapHelpers

  describe "query" do
    test "get tag by id" do
      %Tag{id: id} = make_tag()
      id = Integer.to_string(id)

      assert {:ok,
              %{
                data: %{
                  "tag" => %{
                    "id" => ^id,
                    "text" => _,
                    "insertedAt" => _,
                    "updatedAt" => _
                  }
                }
              }} =
               Absinthe.run(
                 TagQueries.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "id" => id
                   }
                 }
               )
    end

    test "get tag by text" do
      %Tag{text: text} = make_tag()

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
                 TagQueries.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "text" => text
                   }
                 }
               )
    end

    test "get tag by id and text" do
      %Tag{id: id, text: text} = make_tag()
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
                 TagQueries.query(:tag),
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
      make_tag()

      # 2nd tag
      %{text: text, id: id} = make_tag()
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "tags" => tags
                }
              }} = Absinthe.run(TagQueries.query(:tags), Schema)

      assert length(tags) == 2
      assert %{"id" => ^id, "text" => ^text} = List.last(tags)
    end
  end
end
