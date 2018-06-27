defmodule GasWeb.SourceQueries do
  @default_fragment """
    fragment SourceFragment on Source {
      __typename
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
    }
  """

  def query(:sources) do
    """
    query Sources {
      sources {
        ...SourceFragment
      }
    }

    #{@default_fragment}
    """
  end

  def query(:source) do
    """
    query GetSource($source: GetSourceInput!) {
      source(source: $source) {
        ...SourceFragment
        quotes {
          id
          text
          date
        }
      }
    }

    #{@default_fragment}
    """
  end

  def mutation(:source) do
    """
    mutation CreateSource($source: CreateSourceInput!) {
      createSource(source: $source) {
        ...SourceFragment
        quotes {
          id
          text
          date
        }
      }
    }

    #{@default_fragment}
    """
  end

  def mutation(:update_source) do
    """
    mutation UpdateSource($source: UpdateSourceInput!) {
      updateSource(source: $source) {
        ...SourceFragment
        quotes {
          id
          text
          date
        }
      }
    }

    #{@default_fragment}
    """
  end
end
