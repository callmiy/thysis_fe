defmodule ThysisWeb.TagSchemaTest do
  use Thysis.DataCase
  alias ThysisWeb.Schema
  alias ThysisWeb.Query.Tag, as: Query
  alias Thysis.Tag
  alias Thysis.Factory.Tag, as: Factory

  describe "query" do
    test "get tag by id" do
      %Tag{id: id} = Factory.insert()
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
                 Query.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "id" => id
                   }
                 }
               )
    end

    test "get tag by text" do
      %Tag{text: text} = Factory.insert()

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
                 Query.query(:tag),
                 Schema,
                 variables: %{
                   "tag" => %{
                     "text" => text
                   }
                 }
               )
    end

    test "get tag by id and text" do
      %Tag{id: id, text: text} = Factory.insert()
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
                 Query.query(:tag),
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
      Factory.insert()

      # 2nd tag
      %{text: text, id: id} = Factory.insert()
      id = inspect(id)

      assert {:ok,
              %{
                data: %{
                  "tags" => tags
                }
              }} = Absinthe.run(Query.query(:tags), Schema)

      assert length(tags) == 2
      assert %{"id" => ^id, "text" => ^text} = List.last(tags)
    end
  end

  describe "mutation" do
    test "create tag succeeds" do
      %{text: text} = attrs = Factory.params()
      question = Map.get(attrs, :question)

      assert {:ok,
              %{
                data: %{
                  "createTag" => %{
                    "id" => _,
                    "text" => ^text,
                    "question" => ^question
                  }
                }
              }} =
               Absinthe.run(
                 Query.mutation(:tag),
                 Schema,
                 variables: %{
                   "tag" => Factory.stringify(attrs)
                 }
               )
    end
  end
end
