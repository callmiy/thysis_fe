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
            id
            author
            topic
          }

          tag {
            id
            text
          }
        }
      }
    """
  end
end
