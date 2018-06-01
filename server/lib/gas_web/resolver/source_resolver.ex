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

  @doc """
  Returns a string that can be used to display the source (sort of to_string).
  The fields that are important are joined together with "|". Fields that are
  `nil` are ignored
  """
  @spec display(%Source{}, any, any) :: {:ok, String.t()} | {:error, String.t()}
  def display(%Source{} = source, _, _) do
    text =
      source
      |> Map.take([:author, :topic, :publication, :url])
      |> Enum.reduce([], fn
        {_, nil}, acc -> acc
        {_, v}, acc -> [v | acc]
      end)
      |> Enum.join("|")

    {:ok, text}
  end
end
