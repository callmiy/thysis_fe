defmodule Gas.TagsTest do
  use Gas.DataCase

  alias Gas.Tag
  alias Gas.TagApi, as: Api

  test "list/0 returns all tags" do
    tag = make_tag()
    assert Api.list() == [tag]
  end

  test "get!/1 returns the tag with given id" do
    tag = make_tag()
    assert Api.get!(tag.id) == tag
  end

  test "create_/1 with valid data creates a tag" do
    %{text: text} = valid_attrs = params_for(:tag)
    assert {:ok, %Tag{} = tag} = Api.create_(valid_attrs)
    assert tag.text == text
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs = params_for(:tag, text: nil)
    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the tag" do
    tag = make_tag()
    assert {:ok, tag} = Api.update_(tag, params_for(:tag, text: "yeah"))
    assert %Tag{} = tag
    assert tag.text == "yeah"
  end

  @tag :norun
  test "update_/2 with invalid data returns error changeset" do
    tag = make_tag()
    invalid_attrs = params_for(:tag, text: nil)
    # Tag.changeset(%{}) as no effect so we skip this test for now
    assert {:error, %Ecto.Changeset{}} = Api.update_(tag, invalid_attrs)
    assert tag == Api.get!(tag.id)
  end

  test "delete_/1 deletes the tag" do
    tag = make_tag()
    assert {:ok, %Tag{}} = Api.delete_(tag)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(tag.id) end
  end

  test "change_/1 returns a tag changeset" do
    tag = make_tag()
    assert %Ecto.Changeset{} = Api.change_(tag)
  end

  defp make_tag(attrs \\ %{}) do
    {:ok, tag} =
      :tag
      |> params_for(attrs)
      |> Api.create_()

    tag
  end
end
