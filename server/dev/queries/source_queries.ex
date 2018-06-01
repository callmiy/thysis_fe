defmodule GasWeb.SourceQueries do
  def query(:sources) do
    """
    query Sources {
      sources {
        id
        author
        topic
        sourceType {
          id
          name
        }
        publication
        url
        insertedAt
        updatedAt
        display
      }
    }
    """
  end
end
