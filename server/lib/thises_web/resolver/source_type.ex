defmodule ThisesWeb.Resolver.SourceType do
  @moduledoc """
  A resolver for the source type schema
  """
  alias Thises.SourceType
  alias Thises.SourceTypeApi, as: Api

  def source_type(_root, %{source_type: params}, %{context: %{current_user: user}}) do
    case Api.get_source_type_by(params, user.id) do
      %SourceType{} = source_type -> {:ok, source_type}
      nil -> {:error, message: "source_type does not exist."}
    end
  end

  @doc """
  Get all existing source_types.
  """
  @spec source_types(any, any, any) :: {:ok, [%SourceType{}]}
  def source_types(_root, _args, %{context: %{current_user: user}}) do
    {:ok, Api.list(user.id)}
  end
end
