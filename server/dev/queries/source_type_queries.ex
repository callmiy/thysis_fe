defmodule GasWeb.SourceTypeQueries do
  def all_fields_fragment do
    name = "SourceTypeFieldsFragment"

    fragment = """
      fragment #{name} on SourceType {
        id
        name
      }
    """

    {name, fragment}
  end

  def query(:source_type) do
    {frag_name, frag} = all_fields_fragment()

    """
    query SourceType($sourceType: GetSourceTypeInput!) {
      sourceType(sourceType: $sourceType) {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end

  def query(:source_types) do
    {frag_name, frag} = all_fields_fragment()

    """
    query SourceTypes {
      sourceTypes {
        ...#{frag_name}
      }
    }

    #{frag}
    """
  end
end
