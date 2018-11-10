defmodule Thysis.Factory.QuoteTag do
  use Thysis.Factory
  alias Thysis.QuoteTagApi

  def insert(attrs) do
    {:ok, qt} =
      attrs
      |> params()
      |> QuoteTagApi.create_()

    qt
  end

  def params(attrs), do: attrs
end
