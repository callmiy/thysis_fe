defmodule GasWeb.SourceTypeResolver do
  @moduledoc """
  A resolver for the source type schema
  """
  alias Gas.SourceType
  alias Gas.SourceTypeApi, as: Api
  # alias GasWeb.ResolversUtil

  @doc """
  Get a single source_type either by source_type name or id or both.
  """
  @spec source_type(
          any,
          %{source_type: %{id: nil | String.t() | integer, name: nil | String.t()}},
          any
        ) :: {:ok, %SourceType{}} | {:error, message: String.t()}
  def source_type(_root, %{source_type: get_source_type_params} = _args, _info) do
    case Api.get_source_type_by(get_source_type_params) do
      %SourceType{} = source_type -> {:ok, source_type}
      nil -> {:error, message: "source_type does not exist."}
    end
  end

  @doc """
  Get all existing source_types.
  """
  @spec source_types(any, any, any) :: {:ok, [%SourceType{}]}
  def source_types(_root, _args, _info) do
    {:ok, Api.list()}
  end
end
