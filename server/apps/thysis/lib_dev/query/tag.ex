defmodule ThysisWeb.Query.Tag do
  def query(:tag) do
    {frag_name, frag} = all_fields_fragment()

    """
    query Tag($tag: GetTagInput!) {
      tag(tag: $tag) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def query(:tags) do
    {frag_name, frag} = all_fields_fragment()

    """
    query Tags {
      tags {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def mutation(:tag) do
    {frag_name, frag} = all_fields_fragment()

    """
    mutation CreateTag($tag: CreateTagInput!) {
      createTag(tag: $tag) {
        ...#{frag_name}
        quotes {
          id
          text
        }
      }
    }

    #{frag}
    """
  end

  def all_fields_fragment do
    name = "TAG_FIELDS_FRAGMENT"

    fragment = """
      fragment #{name}  on Tag {
        id
        text
        question
        insertedAt
        updatedAt
      }
    """

    {name, fragment}
  end
end
