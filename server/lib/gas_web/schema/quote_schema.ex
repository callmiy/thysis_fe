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
    field(:date, :date)
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

  @desc "When we do full text search, the result returned will contain name of
  the table from which the result was returned. This object contains an
  enum of the possible table names"
  enum :quote_full_search_table do
    value(:quotes)
    value(:sources)
    value(:tags)
    value(:source_types)
  end

  @desc "Result row returned when we search quotes by text"
  object :quote_full_search_result_row do
    field(:tid, non_null(:integer))
    field(:source, non_null(:quote_full_search_table))
    field(:text, non_null(:string))
    field(:column, non_null(:string))
  end

  @desc "Result returned when we search quotes by text"
  object :quote_full_search_result do
    field(:quotes, list_of(:quote_full_search_result_row))
    field(:sources, list_of(:quote_full_search_result_row))
    field(:tags, list_of(:quote_full_search_result_row))
    field(:source_types, list_of(:quote_full_search_result_row))
  end

  # MUTATION INPUTS
  @desc "Inputs for creating a Quote object"
  input_object :create_quote_input do
    @desc "The quote text"
    field(:text, non_null(:string))

    @desc "The source id"
    field(:source_id, non_null(:id))

    @desc "The quote date"
    field(:date, :date)

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

  # QUERY INPUTS
  @desc "Inputs for querying list of quotes"
  input_object :get_quotes do
    field(:source, :id)
  end

  @desc "Input for full text search on quotes, their sources, tags and source
   types"
  input_object :quote_full_search_input do
    field(:text, non_null(:string))
  end

  # QUERIES
  @desc "Queries allowed on Quote object"
  object :quote_query do
    @desc "Query list of quotes - everything, or filter by source"
    field :quotes, type: list_of(:quote) do
      arg(:quote, :get_quotes)
      resolve(&QuoteResolver.quotes/3)
    end

    @desc "Specify any text to get queries or tags, or sources or
    source types matching the text"
    field :quote_full_search, type: :quote_full_search_result do
      arg(:text, non_null(:quote_full_search_input))
      resolve(&QuoteResolver.full_text_search/3)
    end
  end

  # MUTATIONS
  @desc "The mutations allowed on the Quote object"
  object :quote_mutation do
    @desc "Create a quote"
    field :create_quote, type: :quote do
      arg(:quote, non_null(:create_quote_input))

      resolve(&QuoteResolver.create_quote/3)
    end
  end
end
