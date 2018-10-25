defmodule Thises.QuotesTest do
  use Thises.DataCase

  alias Thises.Quote
  alias Thises.QuoteApi, as: Api
  alias Thises.QuoteTagApi, as: TagApi

  defp make_quote(attrs \\ %{}) do
    {:ok, quote_} =
      params_with_assocs(:quote, attrs)
      |> Api.create_()

    quote_
  end

  test "list/0 returns all quotes" do
    quote_ = make_quote()
    assert Api.list() == [quote_]
  end

  test "get/1 returns the quote with given id" do
    quote_ = make_quote()
    assert Api.get(quote_.id) == quote_
  end

  test "create_/1 with valid data creates a quote" do
    %{
      date: date,
      text: text
    } = valid_attrs = params_with_assocs(:quote)

    assert {:ok, %Quote{} = quote_} = Api.create_(valid_attrs)
    assert quote_.date == date
    assert quote_.text == text
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs = params_with_assocs(:quote, text: nil)
    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the quote" do
    quote_ = make_quote()

    %{
      date: date,
      text: text
    } = update_attrs = params_for(:quote)

    assert {:ok, %Quote{} = quote_} = Api.update_(quote_, update_attrs)
    assert quote_.date == date
    assert quote_.text == text
  end

  test "update_/2 with invalid data returns error changeset" do
    quote_ = make_quote()
    assert {:error, %Ecto.Changeset{}} = Api.update_(quote_, %{text: nil})
    assert quote_ == Api.get(quote_.id)
  end

  test "delete_/1 deletes the quote" do
    quote_ = make_quote()
    assert {:ok, %Quote{}} = Api.delete_(quote_)
    assert nil == Api.get(quote_.id)
  end

  test "change_/1 returns a quote changeset" do
    assert %Ecto.Changeset{} = make_quote() |> Api.change_()
  end

  test "has many tags" do
    %Quote{id: quote_id} = quote_ = make_quote()

    insert_list(5, :tag)
    |> Enum.each(&TagApi.create_(%{quote_id: quote_id, tag_id: &1.id}))

    assert %Quote{tags: tags} = Repo.preload(quote_, [:tags])
    assert length(tags) == 5
  end

  test "can not insert one tag multiple times in same quote" do
    qt = insert(:quote_tag)
    quote_tag_attrs = %{tag_id: qt.tag_id, quote_id: qt.quote_id}

    assert {:error, %Ecto.Changeset{}} = TagApi.create_(quote_tag_attrs)
    assert %Quote{tags: tags} = Repo.preload(qt.quote, [:tags])
    assert length(tags) == 1
  end

  test "can insert one tag into multiple quotes" do
    qt = insert(:quote_tag)

    assert %Quote{tags: tags} = Repo.preload(qt.quote, [:tags])
    assert length(tags) == 1

    q = insert(:quote)
    insert(:quote_tag, tag: qt.tag, quote: q)

    assert %Quote{tags: tags} = Repo.preload(q, [:tags])
    assert length(tags) == 1
  end
end
