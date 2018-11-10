defmodule ThysisWeb.Schema.Credential do
  use Absinthe.Schema.Notation

  alias ThysisWeb.Schema

  @desc "User credential"
  object :credential do
    field :credential_id, non_null(:id) do
      resolve(fn credential, _, _ ->
        {:ok, credential.id}
      end)
    end

    field :_id, non_null(:string) do
      resolve(fn credential, _, _ ->
        {:ok, Schema.get_datetime_id(credential.id)}
      end)
    end

    field :schema_type, non_null(:string) do
      resolve(fn _, _, _ -> {:ok, "Credential"} end)
    end

    field(:source, :string)
    field(:token, :string)

    field(:user, :user)

    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end
end
