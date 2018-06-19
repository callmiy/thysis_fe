defmodule Gas.AuthorsTest do
  use Gas.DataCase

  alias Gas.AuthorApi, as: Api
  alias Gas.Author

  defp make_author(attrs \\ %{}) do
    {:ok, author} =
      params_for(:author, attrs)
      |> Api.create_()

    author
  end

  test "list/0 returns all authors" do
    author = make_author()
    assert Api.list() == [author]
  end

  test "get!/1 returns the author with given id" do
    author = make_author()
    assert Api.get!(author.id) == author
  end

  test "create_/1 with valid data creates a author" do
    %{name: name} = attrs = params_for(:author)
    assert {:ok, %Author{} = author} = Api.create_(attrs)
    assert author.name == name
  end

  test "create_/1 with invalid data returns error changeset" do
    assert {:error, %Ecto.Changeset{}} = Api.create_(%{name: nil})
  end

  test "update_/2 with valid data updates the author" do
    author = make_author()
    %{name: name} = attrs = params_for(:author)
    assert {:ok, author} = Api.update_(author, attrs)
    assert %Author{} = author
    assert author.name == name
  end

  test "update_/2 with invalid data returns error changeset" do
    author = make_author()
    assert {:error, %Ecto.Changeset{}} = Api.update_(author, %{name: nil})
    assert author == Api.get!(author.id)
  end

  test "delete_/1 deletes the author" do
    author = make_author()
    assert {:ok, %Author{}} = Api.delete_(author)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(author.id) end
  end

  test "change_/1 returns a author changeset" do
    author = make_author()
    assert %Ecto.Changeset{} = Api.change_(author)
  end
end
