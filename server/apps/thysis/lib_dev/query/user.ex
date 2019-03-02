defmodule ThysisWeb.Query.User do
  alias ThysisWeb.Query.Project

  @frag_name "UserAllFieldsFragment"

  def all_fields_fragment do
    {project_frag_name, project_frag} = Project.all_fields_fragment()

    fragment = """
      fragment #{@frag_name} on User {
        id
        name
        email
        jwt
        insertedAt
        updatedAt
        projects {
          ...#{project_frag_name}
        }
      }

      #{project_frag}
    """

    {@frag_name, fragment}
  end

  @doc "update"
  def update do
    {user_frag_name, user_frag} = all_fields_fragment()

    query = """
        update(user: $user) {
          ...#{user_frag_name}
        }
    """

    %{
      query: query,
      fragments: ~s( #{user_frag} ),
      parameters: "$user: UpdateUser!"
    }
  end

  @doc "refresh"
  def refresh do
    {user_frag_name, user_frag} = all_fields_fragment()

    query = """
        refresh(refresh: $refresh) {
          ...#{user_frag_name}
        }
    """

    %{
      query: query,
      fragments: ~s( #{user_frag} ),
      parameters: "$refresh: RefreshInput!"
    }
  end

  def request_password_recovery_token do
    """
      mutation RequestPwdRecoveryToken($email: String!){
        anfordernPzs(email: $email) {
          email
          token
        }
      }
    """
  end
end
