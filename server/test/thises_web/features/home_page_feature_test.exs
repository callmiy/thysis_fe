defmodule ThysisWeb.HomePageFeatureTest do
  use Thysis.FeatureCase

  alias Thysis.Factory.Tag, as: TagFactory
  alias Thysis.Factory.Source, as: SourceFactory
  alias Thysis.Factory.Author, as: AuthorFactory
  alias Thysis.SourceApi
  alias Thysis.Repo
  alias Thysis.Author
  alias Thysis.Tag

  @moduletag :integration
  @page_title "Gasifier"
  @menu_items_selector "#menu-items .item"
  @tags_modal_id "tag-list-modal"
  @sources_modal_id "sources-modal"
  @author_modal_close_id "author-modal-close"
  @author_modal_submit_id "author-modal-submit"
  @author_new_success_msg ~r/Author created successfully!/
  @tag_modal_close_id "tag-modal-close"
  @tag_modal_submit_id "tag-modal-submit"
  @tag_new_success_msg ~r/Tag created successfully!/
  # @source_modal_close_id "source-modal-close"
  @source_modal_submit_id "source-modal-submit"

  # @tag :no_headless
  test "home page" do
    db_data =
      Task.async(fn ->
        # Given there are 2 tags in the database
        tags =
          TagFactory.insert_list(2)
          |> Enum.map(&Regex.compile!(&1.text))

        # and there are 2 sources in the database
        sources =
          SourceFactory.insert_list(2)
          |> Enum.map(&Regex.compile!(SourceApi.display(&1)))

        %{
          tags: tags,
          sources: sources
        }
      end)

    # when we visit the home page
    navigate_to("/")

    # we see the page title
    assert page_title() == @page_title

    # and we see 7 menu items
    assert [
             _search_quote_link,
             _new_quote_link,
             tags_link,
             sources_link,
             new_author_link,
             new_tag_link,
             new_source_link
           ] = find_all_elements(:css, @menu_items_selector)

    # and we see no tags visible on the page
    refute element?(:id, @tags_modal_id)

    # and we see no sources visible on the page
    refute element?(:id, @sources_modal_id)

    # and we see no author submit button on page
    refute element?(:id, @author_modal_submit_id)

    # and we see no tag submit button on page
    refute element?(:id, @tag_modal_submit_id)

    # and we see no source submit button on page
    refute element?(:id, @source_modal_submit_id)

    # when we click on list tags link
    click(tags_link)

    # tags become visible on page
    assert element?(:id, @tags_modal_id)

    %{tags: tags, sources: sources} = Task.await(db_data)

    assert await(
             true,
             fn ->
               Enum.all?(tags, &visible_in_page?/1)
             end,
             500
           )

    # when we click tags close button
    find_element(:id, "tag-list-modal-close") |> click()

    # tags are no longer visible on page
    refute element?(:id, @tags_modal_id)

    # when we click on sources link
    click(sources_link)

    # sources become visible on page
    assert element?(:id, @sources_modal_id)

    assert await(
             true,
             fn ->
               Enum.all?(sources, &visible_in_page?/1)
             end,
             500
           )

    # when we click sources close button
    find_element(:id, "sources-modal-close") |> click()

    # sources are no longer visible on page
    refute element?(:id, @sources_modal_id)

    # when we click author link
    click(new_author_link)

    # then we see author submit button on page
    assert author_submit_btn = find_element(:id, @author_modal_submit_id)

    # when we fill in author name
    author_name = AuthorFactory.params().last_name
    find_element(:name, "author") |> fill_field(author_name)

    # and click author submit button
    click(author_submit_btn)

    # then there is author in the database
    assert await(
             true,
             fn ->
               match?(
                 %{name: ^author_name},
                 Repo.get_by(Author, name: author_name)
               )
             end,
             500
           )

    # and we see success message
    assert visible_in_page?(@author_new_success_msg)

    # when we click the author close button
    find_element(:id, @author_modal_close_id) |> click()

    # then the author submit button is no longer visible
    refute element?(:id, @author_modal_submit_id)

    # BEGIN NEW TAG MODAL

    # when we click tag link
    click(new_tag_link)

    # then we see tag submit button on page
    assert tag_submit_btn = find_element(:id, @tag_modal_submit_id)

    # when we fill in tag text
    tag_text = TagFactory.params().text
    find_element(:name, "tag") |> fill_field(tag_text)

    # and click tag submit button
    click(tag_submit_btn)

    # then there is tag in the database
    assert await(true, fn ->
             match?(
               %{text: ^tag_text},
               Repo.get_by(Tag, text: tag_text)
             )
           end)

    # and we see success message
    assert visible_in_page?(@tag_new_success_msg)

    # when we click the tag close button
    find_element(:id, @tag_modal_close_id) |> click()

    # then the tag submit button is no longer visible
    refute element?(:id, @tag_modal_submit_id)

    # -----END NEW TAG MODAL

    # -----BEGIN NEW SOURCE MODAL

    # when we click source link
    click(new_source_link)

    # then we see source submit button on page
    assert _source_submit_btn = find_element(:id, @source_modal_submit_id)

    # -----END NEW SOURCE MODAL

    # # if we click search quotes link
    # assert inner_text(search_quote_link) == "Search Quotes"
    # click(search_quote_link)
    # assert current_path() == "/search/quotes"

    # navigate_back()

    # # if we click  quotes link
    # assert inner_text(search_quote_link) == "Search Quotes"
    # click(search_quote_link)
    # assert current_path() == "/search/quotes"

    # navigate_back()
  end
end
