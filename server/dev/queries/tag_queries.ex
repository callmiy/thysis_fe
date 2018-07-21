defmodule GasWeb.TagQueries do
  @all_fields_fragment """
  fragment TAG_FIELDS_FRAGMENT on Tag {
    id
    text
    question
    insertedAt
    updatedAt
  }
  """

  def query(:tag) do
    """
    query Tag($tag: GetTagInput!) {
      tag(tag: $tag) {
        ...TAG_FIELDS_FRAGMENT
      }
    }

    #{@all_fields_fragment}
    """
  end

  def query(:tags) do
    """
    query Tags {
      tags {
        ...TAG_FIELDS_FRAGMENT
      }
    }

    #{@all_fields_fragment}
    """
  end

  def mutation(:tag) do
    """
    mutation CreateTag($tag: CreateTagInput!) {
      createTag(tag: $tag) {
        ...TAG_FIELDS_FRAGMENT
        quotes {
          id
          text
        }
      }
    }

    #{@all_fields_fragment}
    """
  end
end
