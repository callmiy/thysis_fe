defmodule ThysisWeb.Query.SourceType do
  @name "SourceTypeFieldsFragment"

  @fragment """
    fragment #{@name} on SourceType {
      id
      name
    }
  """
  def all_fields_fragment do
    {@name, @fragment}
  end

  def query(:source_type) do
    """
    query SourceType($sourceType: GetSourceTypeInput!) {
      sourceType(sourceType: $sourceType) {
        ...#{@name}
      }
    }

    #{@fragment}
    """
  end

  def query(:source_types) do
    """
    query SourceTypes {
      sourceTypes {
        ...#{@name}
      }
    }

    #{@fragment}
    """
  end

  def create() do
    """
    mutation CreateSourceType($sourceType: CreateSourceTypeInput!) {
      sourceType(sourceType: $sourceType) {
        ...#{@name}
      }
    }

    #{@fragment}
    """
  end
end
