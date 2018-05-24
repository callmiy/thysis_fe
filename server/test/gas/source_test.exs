defmodule Gas.SourcesTest do
  use Gas.DataCase

  alias Gas.Source
  alias Gas.SourceApi, as: Api

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
      citation: citation,
      year: year
    } = valid_attrs = make_source(:attrs)

    assert {:ok, %Source{} = source} = Api.create_(valid_attrs)
    assert source.citation == citation
    assert source.year == year
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs = make_source(:attrs, %{citation: nil})
    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the source" do
    source = make_source()

    assert {:ok, %Source{} = source} =
             source
             |> Api.update_(%{citation: "yeah2011", year: 2011})

    assert source.citation == "yeah2011"
    assert source.year == 2011
  end

  test "update_/2 with invalid data returns error changeset" do
    source = make_source()
    assert {:error, %Ecto.Changeset{}} = Api.update_(source, %{citation: "yea"})
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

  defp make_source(:attrs, attrs \\ %{}) do
    type = insert(:source_type)
    build(:source, Map.put(attrs, :source_type_id, type.id)) |> map()
  end

  defp make_source do
    {:ok, source} = make_source(:attrs) |> Api.create_()
    source
  end
end
