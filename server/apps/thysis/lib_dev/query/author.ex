defmodule ThysisWeb.Query.Author do
  def all_fields_fragment do
    name = "Author_Fields_Fragment"

    fragment = """
      fragment #{name} on Author {
        id
        firstName
        lastName
        middleName
        insertedAt
        updatedAt
      }
    """

    {name, fragment}
  end

  def query(:author) do
    {frag_name, frag} = all_fields_fragment()

    """
    query Author($author: GetAuthorInput!) {
      author(author: $author) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def mutation(:author) do
    {frag_name, frag} = all_fields_fragment()

    """
    mutation CreateAuthor($author: CreateAuthorInput!) {
      createAuthor(author: $author) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def update() do
    {frag_name, frag} = all_fields_fragment()

    """
    mutation UpdateAuthor($author: UpdateAuthorInput!) {
      updateAuthor(author: $author) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def authors do
    {frag_name, frag} = all_fields_fragment()

    """
    query GetAuthors($author: GetAuthorsInput) {
      authors(author: $author) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end
end
