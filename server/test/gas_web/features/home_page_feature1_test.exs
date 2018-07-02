defmodule GasWeb.HomePageFeature1Test do
  use Gas.FeatureCase

  @moduletag :integration

  @page_title "Gasifier"
  @menu_items_selector css("#menu-items .item", count: 7)
  @tags_modal_id "#tag-list-modal"

  test "home page", %{session: session} do
    # Given there are 2 tags in the database
    tags =
      Task.async(fn ->
        insert_list(2, :tag)
        |> Enum.map(& &1.text)
      end)

    # and there are 2 sources in the database
    _sources =
      Task.async(fn ->
        SourceFactory.insert_list(2)
        |> Enum.map(&Regex.compile!(SourceApi.display(&1)))
      end)

    # when I visit the home page
    session = visit(session, "/")

    # I see the page title
    assert page_title(session) == @page_title

    # and I see 7 menu items
    assert [
             _search_quote_link,
             _new_quote_link,
             tags_link,
             _sources_link,
             _new_author_link,
             _new_tag_link,
             _new_source_link
           ] = find(session, @menu_items_selector)

    # and I see no tags visible on the page
    refute visible?(
             session,
             css(@tags_modal_id)
           )

    tags = Task.await(tags)

    # When I click on tags link
    El.click(tags_link)

    # tags become visible on page

    assert await(
             true,
             fn ->
               page_source = page_source(session)
               Enum.all?(tags, &String.contains?(page_source, &1))
             end,
             100
           )
  end
end
