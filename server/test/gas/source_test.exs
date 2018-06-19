defmodule Gas.SourceTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api

  defp make_source(attrs \\ %{}) do
    {:ok, %{source: source}} = Api.create_(params_with_assocs(:source, attrs))

    %{
      source
      | author_ids: nil,
        author_maps: nil
    }
  end

  test "list/0 returns all sources" do
    source = make_source()
    assert Api.list() == [source]
  end

  test "get!/1 returns the source with given id" do
    source = make_source()
    assert Api.get!(source.id) == source
  end

  test "create_/1 with valid data creates a source" do
    %{
      topic: topic
    } = attrs = params_with_assocs(:source)

    assert {:ok,
            %{
              source: %Source{} = source,
              author_maps: {1, [_]}
            }} =
             Api.create_(%{
               source: attrs,
               author_maps: [params_for(:author)]
             })

    assert source.topic == topic
  end

  test "create_/1 with no authors error" do
    assert {:error, :no_authors} =
             Api.create_(%{
               source: params_with_assocs(:source)
             })
  end

  test "create_/1 with invalid data returns error changeset" do
    assert {:error, :source, %Ecto.Changeset{}, %{}} =
             Api.create_(%{
               source: params_with_assocs(:source, topic: nil),
               author_maps: [params_for(:author)]
             })
  end

  test "update_/2 with valid data updates the source" do
    source = make_source()

    assert {:ok, %Source{} = source} =
             source
             |> Api.update_(%{topic: "sss73bsbddj"})

    assert source.topic == "sss73bsbddj"
  end

  test "update_/2 with invalid data returns error changeset" do
    source = make_source()
    assert {:error, %Ecto.Changeset{}} = Api.update_(source, %{topic: nil})
    assert source == Api.get!(source.id)
  end

  test "delete_/1 deletes the source" do
    source = make_source()
    assert {:ok, %Source{}} = Api.delete_(source)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(source.id) end
  end

  test "change_/1 returns a source changeset" do
    source = make_source()
    assert %Ecto.Changeset{} = Api.change_(source, %{})
  end
end
