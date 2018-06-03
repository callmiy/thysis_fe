defmodule GasWeb.SourceQueries do
  def query(:sources) do
    """
    query Sources {
      sources {
        id
        author
        topic
        publication
        url
        insertedAt
        updatedAt
        display
        sourceType {
          id
          name
        }
      }
    }
    """
  end

  def mutation(:source) do
    """
    mutation CreateSource($source: CreateSourceInput!) {
      createSource(source: $source) {
        id
        author
        topic
        publication
        url
        insertedAt
        updatedAt
        display
        sourceType {
          id
          name
        }
        quotes {
          id
          text
          date
        }
      }
    }
    """
  end
end
