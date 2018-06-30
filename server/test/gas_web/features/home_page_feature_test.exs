defmodule GasWeb.HomePageFeatureTest do
  use Gas.FeatureCase

  @moduletag :integration
  @page_title "Gasifier"

  test "home page" do
    # when we visit the home page
    navigate_to("/")

    # we see the page title
    assert page_title() == @page_title
  end
end
