defmodule Thises.SourceTypesTest do
  use Thises.DataCase

  alias Thises.SourceType
  alias Thises.SourceTypeApi, as: Api

  test "list/0 returns all source_types" do
    source_type = insert(:source_type)
    assert Api.list() == [source_type]
  end

  test "get!/1 returns the source_type with given id" do
    source_type = insert(:source_type)
    assert Api.get!(source_type.id) == source_type
  end

  test "create_/1 with valid data inserts a source_type" do
    assert {:ok, %SourceType{}} =
             :source_type
             |> build()
             |> map()
             |> Api.create_()
  end

  test "create_/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} =
             :source_type
             |> build()
             |> map()
             |> Map.put(:name, nil)
             |> Api.create_()
  end

  test "update_/2 with valid data updates the source_type" do
    source_type = insert(:source_type)
    update_attrs = build(:source_type) |> map()

    assert {:ok, %SourceType{}} =
             source_type
             |> Api.update_(update_attrs)
  end

  test "update_/2 with invalid data returns error changeset" do
    source_type = insert(:source_type)
    invalid_attrs = build(:source_type) |> map() |> Map.put(:name, nil)

    assert {:error, %Ecto.Changeset{}} = Api.update_(source_type, invalid_attrs)
    assert source_type == Api.get!(source_type.id)
  end

  test "delete_/1 deletes the source_type" do
    source_type = insert(:source_type)
    assert {:ok, %SourceType{}} = Api.delete_(source_type)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(source_type.id) end
  end

  test "change_/1 returns a source_type changeset" do
    source_type = insert(:source_type)
    assert %Ecto.Changeset{} = Api.change_(source_type)
  end
end
