defmodule GasWeb.SourceResolver do
  @moduledoc """
  A resolver for the source schema
  """
  alias Gas.Source
  alias Gas.SourceApi, as: Api
  # alias GasWeb.ResolversUtil

  @doc """
  Get all sources.
  """
  @spec sources(any, any, any) :: {:ok, [%Source{}]}
  def sources(_root, _args, _info) do
    {:ok, Api.list()}
  end
end
