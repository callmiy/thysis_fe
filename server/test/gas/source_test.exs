defmodule Gas.SourcesTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api

  defp make_source(attrs \\ %{}) do
    {:ok, source} =
      params_with_assocs(:source, attrs)
      |> Api.create_()

    source
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
      author: author,
      topic: topic
    } = valid_attrs = params_with_assocs(:source)

    assert {:ok, %Source{} = source} = Api.create_(valid_attrs)
    assert source.author == author
    assert source.topic == topic
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs = params_with_assocs(:source, author: nil)
    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the source" do
    source = make_source()

    assert {:ok, %Source{} = source} =
             source
             |> Api.update_(%{author: "yeah", topic: "sss73bsbddj"})

    assert source.author == "yeah"
    assert source.topic == "sss73bsbddj"
  end

  test "update_/2 with invalid data returns error changeset" do
    source = make_source()
    assert {:error, %Ecto.Changeset{}} = Api.update_(source, %{author: nil})
    assert source == Api.get!(source.id)
  end

  test "delete_/1 deletes the source" do
    source = make_source()
    assert {:ok, %Source{}} = Api.delete_(source)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(source.id) end
  end

  test "change_/1 returns a source changeset" do
    source = make_source()
    assert %Ecto.Changeset{} = Api.change_(source)
  end
end
