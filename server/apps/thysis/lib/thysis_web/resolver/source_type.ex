defmodule ThysisWeb.Resolver.SourceType do
  @moduledoc """
  A resolver for the source type schema
  """
  alias Thysis.SourceType
  alias Thysis.SourceTypeApi, as: Api
  alias ThysisWeb.Resolver

  def source_type(_root, %{source_type: params}, %{context: %{current_user: user}}) do
    case Api.get_source_type_by(params, user.id) do
      %SourceType{} = source_type -> {:ok, source_type}
      nil -> {:error, message: "source_type does not exist."}
    end
  end

  def source_type(_, _, _), do: Resolver.unauthorized()

  @doc """
  Get all existing source_types for a user.
  """
  @spec source_types(any, any, any) :: {:ok, [%SourceType{}]}
  def source_types(_root, _args, %{context: %{current_user: user}}) do
    {:ok, Api.list(user.id)}
  end

  def source_types(_, _, _), do: Resolver.unauthorized()

  def create(_, %{source_type: params}, %{context: %{current_user: user}}) do
    case params
         |> Map.put(:user_id, user.id)
         |> Api.create_() do
      {:ok, %SourceType{} = source_type} ->
        {:ok, source_type}

      {:error, changeset} ->
        {:error, Resolver.changeset_errors_to_string(changeset)}
    end
  end

  def create(_, _, _), do: Resolver.unauthorized()
end
