defmodule ThysisWeb.Query.Project do
  @fragment_name "ProjectAllFieldsFragment"

  def all_fields_fragment do
    fragment = """
      fragment #{@fragment_name} on Project {
        id
        title
        user {
          id
        }
      }

    """

    {@fragment_name, fragment}
  end

  @doc "create"
  def create do
    {_, frag} = all_fields_fragment()

    query = """
        project(project: $project) {
          ...#{@fragment_name}
        }
    """

    %{
      query: query,
      fragments: ~s( #{frag} ),
      parameters: "$project: CreateProjectInput!"
    }
  end

  @doc "list"
  def list do
    {_, frag} = all_fields_fragment()

    query = """
        projects {
          ...#{@fragment_name}
        }
    """

    %{
      query: query,
      fragments: ~s(#{frag})
    }
  end

  @doc "get"
  def get do
    {_, frag} = all_fields_fragment()

    query = """
        project(project: $project) {
          ...#{@fragment_name}
        }
    """

    %{
      query: query,
      fragments: ~s( #{frag} ),
      parameters: "$project: GetProjectInput!"
    }
  end
end
