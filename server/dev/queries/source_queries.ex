defmodule GasWeb.SourceQueries do
  alias GasWeb.AuthorQueries
  alias GasWeb.SourceTypeQueries
  alias GasWeb.QuoteQueries

  def all_fields_fragment do
    name = "SourceAllFieldsFragment"

    fragment = """
      fragment #{name} on Source {
        id
        topic
        year
        publication
        url
        insertedAt
        updatedAt
        display
      }
    """

    {name, fragment}
  end

  defp fragment do
    {frag_name, frag} = all_fields_fragment()
    {author_frag_name, author_frag} = AuthorQueries.all_fields_fragment()
    {st_frag_name, st_frag} = SourceTypeQueries.all_fields_fragment()
    {quote_frag_name, quote_frag} = QuoteQueries.all_fields_fragment()

    fields = """
    ...#{frag_name}

    authors {
      ...#{author_frag_name}
    }

    sourceType {
      ...#{st_frag_name}
    }

    quotes {
      ...#{quote_frag_name}
    }
    """

    frags = "#{frag} #{author_frag} #{st_frag} #{quote_frag}"

    {fields, frags}
  end

  def query(:sources) do
    {fields, frags} = fragment()

    """
    query Sources {
      sources {
        #{fields}
      }
    }

    #{frags}
    """
  end

  def query(:source) do
    {fields, frags} = fragment()

    """
    query GetSource($source: GetSourceInput!) {
      source(source: $source) {
        #{fields}
      }
    }

    #{frags}
    """
  end

  def mutation(:source) do
    {fields, frags} = fragment()

    """
    mutation CreateSource($source: CreateSourceInput!) {
      createSource(source: $source) {
        #{fields}
      }
    }

    #{frags}
    """
  end

  def mutation(:update_source) do
    {fields, frags} = fragment()

    """
    mutation UpdateSource($source: UpdateSourceInput!) {
      updateSource(source: $source) {
        #{fields}
      }
    }

    #{frags}
    """
  end
end
