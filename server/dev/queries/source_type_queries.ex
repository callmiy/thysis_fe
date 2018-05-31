defmodule GasWeb.SourceTypeQueries do
  def query(:source_type) do
    """
    query SourceType($sourceType: GetSourceTypeInput!) {
      sourceType(sourceType: $sourceType) {
        id
        name
      }
    }
    """
  end

  def query(:source_types) do
    """
    query SourceTypes {
      sourceTypes {
        id
        name
      }
    }
    """
  end
end
