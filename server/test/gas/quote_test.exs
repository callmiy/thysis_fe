defmodule Gas.QuotesTest do
  use Gas.DataCase

  alias Gas.Quote
  alias Gas.QuoteApi, as: Api

  test "list/0 returns all quotes" do
    quote_ = make_quote()
    assert Api.list() == [quote_]
  end

  test "get!/1 returns the quote with given id" do
    quote_ = make_quote()
    assert Api.get!(quote_.id) == quote_
  end

  test "create_/1 with valid data creates a quote" do
    %{
      date: date,
      page_start: start,
      page_end: end_,
      text: text
    } = valid_attrs = make_quote(:attrs)

    assert {:ok, %Quote{} = quote_} = Api.create_(valid_attrs)
    assert quote_.date == date
    assert quote_.page_end == end_
    assert quote_.page_start == start
    assert quote_.text == text
  end

  test "create_/1 with invalid data returns error changeset" do
    invalid_attrs = make_quote(:attrs, %{page_start: nil})
    assert {:error, %Ecto.Changeset{}} = Api.create_(invalid_attrs)
  end

  test "update_/2 with valid data updates the quote" do
    quote_ = make_quote()

    %{
      date: date,
      page_start: start,
      page_end: end_,
      text: text
    } = update_attrs = make_quote(:attrs)

    assert {:ok, %Quote{} = quote_} = Api.update_(quote_, update_attrs)
    assert quote_.date == date
    assert quote_.page_end == end_
    assert quote_.page_start == start
    assert quote_.text == text
  end

  test "update_/2 with invalid data returns error changeset" do
    quote_ = make_quote()
    assert {:error, %Ecto.Changeset{}} = Api.update_(quote_, %{date: nil})
    assert quote_ == Api.get!(quote_.id)
  end

  test "delete_/1 deletes the quote" do
    quote_ = make_quote()
    assert {:ok, %Quote{}} = Api.delete_(quote_)
    assert_raise Ecto.NoResultsError, fn -> Api.get!(quote_.id) end
  end

  test "change_/1 returns a quote changeset" do
    assert %Ecto.Changeset{} = make_quote() |> Api.change_()
  end

  defp make_quote(:attrs, attrs \\ %{}) do
    source = insert(:source)
    build(:quote, Map.put(attrs, :source_id, source.id)) |> map()
  end

  defp make_quote do
    {:ok, quote_} = make_quote(:attrs) |> Api.create_()
    quote_
  end
end
