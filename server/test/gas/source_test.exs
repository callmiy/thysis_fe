defmodule Gas.SourceTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api
  alias Gas.Factory.Source, as: Factory

  defp make_source(attrs \\ %{}) do
    Factory.insert(attrs)
    |> Map.merge(%{
      author_ids: nil,
      author_attrs: nil
    })
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
        author_attrs: [params_for(:author)]
      )

    assert {:ok,
            %{
              source: %Source{} = source,
              author_attrs: {1, [_]}
            }} = Api.create_(attrs)

    assert source.topic == topic
  end

  # @tag :norun
  test "create_/1 with no authors error" do
    assert {:error, :source, %Ecto.Changeset{errors: [authors: _]}, %{}} =
             Factory.params_with_assocs()
             |> Api.create_()
  end

  # @tag :norun
  test "create_/1 invalid author attributes error" do
    assert {
             :error,
             :source,
             %Ecto.Changeset{
               errors: [
                 author_attrs: {
                   "[name: {can't be blank, [validation: required] }]",
                   []
                 }
               ]
             },
             %{}
           } =
             Factory.params_with_assocs(
               :with_authors,
               author_attrs: [%{}, %{}]
             )
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
             Factory.params_for(:with_authors, source_type: nil)
             |> Api.create_()
  end

  # @tag :norun
  test "update_/2 with valid data updates the source" do
    source = make_source()

    assert {:ok, %{source: %Source{} = source}} =
             source
             |> Api.update_(%{topic: "sss73bsbddj"})

    assert source.topic == "sss73bsbddj"
  end

  # @tag :norun
  test "update_/2 with invalid data returns error changeset" do
    source = make_source()

    assert {
             :error,
             :source,
             %Ecto.Changeset{},
             _success
           } = Api.update_(source, %{topic: nil})

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
