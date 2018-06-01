defmodule GasWeb.QuoteSchema do
  @moduledoc """
  Schema definition for Quote resource
  """

  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Gas.Repo

  alias GasWeb.QuoteResolver

  @desc "A Quote"
  object :quote do
    field(:id, non_null(:id))
    field(:text, non_null(:string))
    field(:date, non_null(:date))
    field(:page_start, :integer)
    field(:page_end, :integer)
    field(:volume, :string)
    field(:issue, :string)
    field(:extras, :string)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))

    field(:source, :source, resolve: assoc(:source))
    field(:tag, list_of(:tag), resolve: assoc(:tag))
  end

  @desc "Inputs for creating a Quote object"
  input_object :create_quote_input do
    @desc "The quote text"
    field(:text, non_null(:string))

    @desc "The source id"
    field(:source_id, non_null(:id))

    @desc "The quote date"
    field(:date, non_null(:date))

    @desc "The tags i.e subject matters of the quote"
    field(:tags, non_null(list_of(:id)))

    @desc "Optional start of page where quote is located"
    field(:page_start, :integer)

    @desc "Optional end of page where quote is located"
    field(:page_end, :integer)

    @desc "Optional (journal, textbook, magazine etc.) volume number"
    field(:volume, :string)

    @desc "Optional (journal, textbook, magazine etc.) issue number"
    field(:issue, :string)

    @desc "Optional miscellaneous information with regards to the quote"
    field(:extras, :string)
  end

  @desc "The mutations allowed on the Quote object"
  object :quote_mutation do
    @desc "Create a quote"
    field :create_quote, type: :quote do
      arg(:quote, non_null(:create_quote_input))

      resolve(&QuoteResolver.create_quote/3)
    end
  end
end
