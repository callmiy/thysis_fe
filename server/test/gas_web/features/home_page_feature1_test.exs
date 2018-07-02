defmodule GasWeb.HomePageFeature1Test do
  use Gas.FeatureCase

  @moduletag :integration

  test "home page", %{session: session} do
    # Given there are 2 tags in the database
    # _tags =
    #   Task.async(fn ->
    #     insert_list(2, :tag)
    #     |> Enum.map(&Regex.compile!(&1.text))
    #   end)

    # and there are 2 sources in the database
    # _sources =
    #   Task.async(fn ->
    #     SourceFactory.insert_list(2)
    #     |> Enum.map(&Regex.compile!(SourceApi.display(&1)))
    #   end)

    # when we visit the home page
    session
    |> visit("/")
  end
end
