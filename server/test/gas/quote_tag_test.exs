defmodule Thises.QuoteTagApiTest do
  use Thises.DataCase

  alias Thises.QuoteTag
  alias Thises.QuoteTagApi, as: Api

  defp make_quote_tag(attrs \\ %{}) do
    {:ok, quote_tag} =
      :quote_tag
      |> params_with_assocs(attrs)
      |> Api.create_()

    quote_tag
  end

  test "list/0 returns all quote_tags" do
    quote_tag = make_quote_tag()
    assert Api.list() == [quote_tag]
  end

  test "get!/1 returns the quote_tag with given id" do
    quote_tag = make_quote_tag()
    assert Api.get!(quote_tag.id) == quote_tag
  end

  test "create_/1 with valid data creates a quote_tag" do
    attrs = params_with_assocs(:quote_tag)
    assert {:ok, %QuoteTag{}} = Api.create_(attrs)
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs =
      :quote_tag
      |> params_with_assocs()
      |> Map.put(:quote_id, nil)

    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the quote_tag" do
    quote_tag = make_quote_tag()
    quote_ = insert(:quote)
    tag = insert(:tag)
    attrs = %{tag_id: tag.id, quote_id: quote_.id}

    assert {:ok, quote_tag} = Api.update_(quote_tag, attrs)
    assert %QuoteTag{} = quote_tag
  end

  test "update_/2 with invalid data returns error changeset" do
    quote_tag = make_quote_tag()
    quote_ = insert(:quote)
    invalid_attrs = %{tag_id: nil, quote_id: quote_.id}

    assert {:error, %Ecto.Changeset{}} = Api.update_(quote_tag, invalid_attrs)
    assert quote_tag == Api.get!(quote_tag.id)
  end

  test "delete_/1 deletes the quote_tag" do
    quote_tag = make_quote_tag()
    assert {:ok, %QuoteTag{}} = Api.delete_(quote_tag)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(quote_tag.id) end
  end

  test "change_/1 returns a quote_tag changeset" do
    quote_tag = make_quote_tag()
    assert %Ecto.Changeset{} = Api.change_(quote_tag)
  end
end
