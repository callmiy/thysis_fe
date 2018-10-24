defmodule GasWeb.Query.User do
  def all_fields_fragment do
    name = "UserAllFieldsFragment"

    fragment = """
      fragment #{name} on User {
        _rev
        userId
        _id
        schemaType
        name
        email
        jwt
        insertedAt
        updatedAt
      }
    """

    {name, fragment}
  end

  @doc false
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
end
