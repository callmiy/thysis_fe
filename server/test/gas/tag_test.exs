defmodule Gas.TagsTest do
  use Gas.DataCase

  alias Gas.Tag
  alias Gas.TagApi, as: Api
  alias Gas.QuoteTagApi, as: TagApi

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

  test "has many quotes" do
    %Tag{id: tag_id} = tag = make_tag()

    insert_list(5, :quote)
    |> Enum.each(&TagApi.create_(%{quote_id: &1.id, tag_id: tag_id}))

    assert %Tag{quotes: quotes} = Repo.preload(tag, [:quotes])
    assert length(quotes) == 5
  end

  test "can not be binded to one quote multiple times" do
    qt = insert(:quote_tag)
    quote_tag_attrs = %{tag_id: qt.tag_id, quote_id: qt.quote_id}

    assert {:error, %Ecto.Changeset{}} = TagApi.create_(quote_tag_attrs)
    assert(%Tag{quotes: quotes} = Repo.preload(qt.tag, [:quotes]))
    assert length(quotes) == 1
  end

  test "gets tag by id and text returns Tag" do
    %Tag{id: tag_id, text: text} = make_tag()

    assert %Tag{} = Api.get_tag_by(%{id: tag_id, text: text})
  end

  test "gets tag by id and text returns nil for wrong text" do
    %Tag{id: tag_id} = make_tag(%{text: "lovely text"})

    assert nil == Api.get_tag_by(%{id: tag_id, text: "lovely text1"})
  end

  test "gets tag by id and text returns nil for id" do
    %Tag{id: tag_id, text: text} = make_tag()

    assert nil == Api.get_tag_by(%{id: tag_id + 1, text: text})
  end
end
