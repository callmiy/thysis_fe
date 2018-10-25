defmodule Thises.Factory.QuoteTag do
  use Thises.Factory
  alias Thises.QuoteTagApi

  def insert(attrs) do
    {:ok, qt} =
      attrs
      |> params()
      |> QuoteTagApi.create_()

    qt
  end

  def params(attrs), do: attrs
end
