defmodule GasWeb.QuoteQueries do
  def mutation(:create_quote) do
    """
      mutation createQuote($quote: CreateQuoteInput!) {
        createQuote(quote: $quote) {
          id
          text
          date
          pageStart
          pageEnd
          volume
          issue
          extras
          insertedAt
          updatedAt

          source {
            ...SourceFragment
          }

          tag {
            id
            text
          }
        }
      }

      fragment SourceFragment on Source {
        id
        topic
        __typename
      }
    """
  end

  def mutation() do
    """
    mutation createQuote($quote: CreateQuoteInput!) {
      createQuote(quote: $quote) {
        id
        text
        date
        source {
          ...SourceMiniFrag
          __typename
        }
        __typename
      }
    }

    fragment SourceMiniFrag on Source {
      id
      display
      sourceType {
        ...SourceTypeFrag
        __typename
      }
      __typename
    }

    fragment SourceTypeFrag on SourceType {
      id
      name
      __typename
    }

    """
  end

  def query(:quotes) do
    """
    query GetQuotesQuery($quote: GetQuotes) {
      quotes(quote: $quote) {
        id
        text
        source {
          ...SourceFragment
        }
      }
    }

    fragment SourceFragment on Source {
      id
      __typename
    }
    """
  end

  def query(:full_text_search) do
    result_row = """
    {
      tid
      text
      source
      column
    }
    """

    """
    query GetAllMatchingTexts($text: QuoteFullSearchInput!) {
      quoteFullSearch(text: $text) {
        quotes      #{result_row}
        sources     #{result_row}
        tags        #{result_row}
        sourceTypes #{result_row}
        authors #{result_row}
      }
    }
    """
  end

  def variables do
    %{
      "quote" => %{
        "date" => "1111-11-11",
        "extras" => "1111",
        "pageStart" => 1,
        "quote" => "aaaa",
        "sourceId" => "234",
        "tags" => ["151", "103", "104"],
        "text" => "",
        "volume" => "11"
      }
    }
  end
end
