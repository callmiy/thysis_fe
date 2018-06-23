defmodule Gas.SourceTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api
  alias Gas.Factory.Source, as: Factory

  defp make_source(attrs \\ %{}) do
    {:ok, %{source: source}} =
      Factory.params_with_assocs(:source, attrs)
      |> Api.create_()

    %{
      source
      | author_ids: nil,
        author_maps: nil
    }
  end

  defp assert_source_equal(source_a, source_b) do
    assert Map.from_struct(source_a)
           |> Enum.all?(fn
             {:authors, authors} ->
               authors_b = Enum.sort_by(source_b.authors, & &1.id)
               Enum.sort_by(authors, & &1.id) == authors_b

             {key, val} ->
               val == Map.get(source_b, key)
           end)
  end

  # @tag :norun
  test "list/1 returns all sources" do
    source = make_source()
    [list] = Api.list(:authors)
    assert_source_equal(source, list)
  end

  # @tag :norun
  test "get/1 returns the source with given id" do
    source = make_source()
    assert_source_equal(Api.get(source.id), source)
  end

  # @tag :norun
  test "create_/1 with valid data creates a source" do
    %{topic: topic} =
      attrs =
      Factory.params_with_assocs(
        :source,
        author_maps: [params_for(:author)]
      )

    assert {:ok,
            %{
              source: %Source{} = source,
              author_maps: {1, [_]}
            }} = Api.create_(attrs)

    assert source.topic == topic
  end

  # @tag :norun
  test "create_/1 with no authors error" do
    assert {:error, :source, %Ecto.Changeset{errors: [author_maps: _]}, %{}} =
             :source
             |> Factory.params_with_assocs(author_maps: nil, author_ids: nil)
             |> Api.create_()
  end

  # @tag :norun
  test "create_/1 with invalid data returns error changeset" do
    assert {:error, :source, %Ecto.Changeset{}, %{}} =
             Factory.params_with_assocs(:source, topic: nil) |> Api.create_()
  end

  # @tag :norun
  test "create_/1 with no source type returns error changeset" do
    assert {:error, :source, %Ecto.Changeset{}, %{}} =
             Factory.params_for(:source) |> Api.create_()
  end

  # @tag :norun
  test "update_/2 with valid data updates the source" do
    source = make_source()

    assert {:ok, %Source{} = source} =
             source
             |> Api.update_(%{topic: "sss73bsbddj"})

    assert source.topic == "sss73bsbddj"
  end

  # @tag :norun
  test "update_/2 with invalid data returns error changeset" do
    source = make_source()
    assert {:error, %Ecto.Changeset{}} = Api.update_(source, %{topic: nil})
    assert_source_equal(source, Api.get(source.id))
  end

  # @tag :norun
  test "delete_/1 deletes the source" do
    source = make_source()
    assert {:ok, %Source{}} = Api.delete_(source)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(source.id) end
  end

  # @tag :norun
  test "change_/1 returns a source changeset" do
    assert %Ecto.Changeset{} = make_source() |> Api.change_()
  end
end
