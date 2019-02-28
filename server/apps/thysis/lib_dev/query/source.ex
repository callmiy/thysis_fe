defmodule ThysisWeb.Query.Source do
  @frag_name "SourceAllFieldsFragment"

  alias ThysisWeb.Query.Author, as: AuthorQuery
  alias ThysisWeb.Query.SourceType, as: SourceTypeQuery
  alias ThysisWeb.Query.Quote, as: QuoteQuery

  def all_fields_fragment do
    fragment = """
      fragment #{@frag_name} on Source {
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

    {@frag_name, fragment}
  end

  defp fragment do
    {frag_name, frag} = all_fields_fragment()
    {author_frag_name, author_frag} = AuthorQuery.all_fields_fragment()
    {st_frag_name, st_frag} = SourceTypeQuery.all_fields_fragment()
    {quote_frag_name, quote_frag} = QuoteQuery.all_fields_fragment()

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

  def sources do
    {fields, frags} = fragment()

    query = """
      sources(source: $source) {
        #{fields}
    }
    """

    %{
      query: query,
      params: "$source: GetSourcesInput!",
      fragments: frags
    }
  end
end
