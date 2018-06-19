defmodule GasWeb.AuthorQueries do
  def query(:author) do
    """
    query Author($author: GetAuthorInput!) {
      author(author: $author) {
        id
        name
        insertedAt
        updatedAt
      }
    }
    """
  end

  def query(:authors) do
    """
    query GetAuthors {
      authors {
        id
        name
      }
    }
    """
  end

  def mutation(:author) do
    """
    mutation CreateAuthor($author: CreateAuthorInput!) {
      createAuthor(author: $author) {
        id
        name
      }
    }
    """
  end
end
