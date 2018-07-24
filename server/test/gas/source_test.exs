defmodule Gas.SourceTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api
  alias Gas.Factory.Source, as: Factory

  defp make_source(attrs \\ %{})

  defp make_source(attrs) when is_list(attrs),
    do:
      Map.new(attrs)
      |> make_source()

  defp make_source(%{} = attrs) do
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
               case is_list(authors) && is_list(source_b.authors) do
                 true ->
                   a = Enum.map(authors, & &1.id) |> Enum.sort()
                   b = Enum.map(source_b.authors, & &1.id) |> Enum.sort()
                   a == b

                 _ ->
                   true
               end

             {key, val} ->
               val == Map.get(source_b, key)
           end)
  end

  # @tag :skip
  test "list/1 returns all sources" do
    source = make_source()
    [list] = Api.list()
    assert_source_equal(source, list)
  end

  # @tag :skip
  test "get/1 returns the source with given id" do
    source = make_source()
    assert_source_equal(Api.get(source.id), source)
  end

  # @tag :skip
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

  # @tag :skip
  test "create_/1 with no authors error" do
    assert {:error, :source, %Ecto.Changeset{errors: [authors: _]}, %{}} =
             Factory.params_with_assocs()
             |> Api.create_()
  end

  # @tag :skip
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

  # @tag :skip
  test "create_/1 with invalid data returns error changeset" do
    assert {:error, :source, %Ecto.Changeset{}, %{}} =
             Factory.params_with_assocs(:source, topic: nil) |> Api.create_()
  end

  # @tag :skip
  test "create_/1 with no source type returns error changeset" do
    assert {:error, :source, %Ecto.Changeset{}, %{}} =
             Factory.params_for(:with_authors, source_type: nil)
             |> Api.create_()
  end

  # @tag :skip
  test "update_/2 with valid data updates the source" do
    source = make_source()
    topic = "sss73bsbddj"

    assert {:ok, %{source: %Source{topic: ^topic}}} = Api.update_(source, %{topic: topic})
  end

  # @tag :skip
  test "update_/2 with deleted authors succeed" do
    author_ids = insert_list(3, :author) |> Enum.map(& &1.id)
    taken = Enum.take(author_ids, 2)
    source = make_source(author_ids: author_ids, author_attrs: nil)
    topic = "sss73bsbddj"

    assert {:ok, %{source: %Source{authors: authors, topic: ^topic}}} =
             source
             |> Api.update_(%{
               topic: topic,
               deleted_authors: taken
             })

    authors = Enum.map(authors, & &1.id)
    assert length(authors) == 1
    refute Enum.all?(taken, &Enum.member?(authors, &1))
  end

  # @tag :skip
  test "update_/2 with inserted authors succeed" do
    author_id = insert(:author).id
    %{authors: source_authors} = source = make_source()

    assert {:ok, %{source: %Source{authors: authors}}} =
             source
             |> Api.update_(%{
               author_ids: [author_id]
             })

    authors = Enum.map(authors, & &1.id)
    source_authors = Enum.map(source_authors, & &1.id)
    assert length(authors) == length(source_authors) + 1
    assert Enum.member?(authors, author_id)
    refute Enum.member?(source_authors, author_id)
  end

  # @tag :skip
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

  # @tag :skip
  test "delete_/1 deletes the source" do
    source = make_source()
    assert {:ok, %Source{}} = Api.delete_(source)
    assert Api.get(source.id) == nil
  end

  # @tag :skip
  test "change_/1 returns a source changeset" do
    assert %Ecto.Changeset{} = make_source() |> Api.change_()
  end
end
