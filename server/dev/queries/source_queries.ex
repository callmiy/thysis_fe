defmodule GasWeb.SourceQueries do
  @fields """
    id
    topic
    year
    publication
    url
    insertedAt
    updatedAt
    display
    sourceType {
      id
      name
    }
    authors {
      id
      name
    }
  """

  def query(:sources) do
    """
    query Sources {
      sources {
        #{@fields}
      }
    }
    """
  end

  def query(:source) do
    """
    query GetSource($source: GetSourceInput!) {
      source(source: $source) {
        #{@fields}
        quotes {
          id
          text
          date
        }
      }
    }
    """
  end

  def mutation(:source) do
    """
    mutation CreateSource($source: CreateSourceInput!) {
      createSource(source: $source) {
        #{@fields}
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
