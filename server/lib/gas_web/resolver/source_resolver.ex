defmodule GasWeb.SourceResolver do
  @moduledoc """
  A resolver for the source schema
  """
  alias Gas.Source
  alias Gas.SourceApi, as: Api
  alias GasWeb.ResolversUtil

  @doc """
  Get all sources.
  """
  @spec sources(any, any, any) :: {:ok, [%Source{}]}
  def sources(_root, _args, _info) do
    {:ok, Api.list()}
  end

  @doc """
  Get one source.
  """
  @spec source(any, %{source: %{id: String.t()}}, any) :: {:ok, %Source{}} | {:error, String.t()}
  def source(_root, %{source: %{id: id}} = _args, _info) do
    case Api.get(id) do
      %Source{} = source_ -> {:ok, source_}
      nil -> {:error, "No source with id: #{id}"}
    end
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
      |> Enum.reverse()
      |> Enum.join(" | ")

    {:ok, text}
  end

  @doc """
  Create a source
  """
  @spec create_source(any, %{source: %{author: String.t(), topic: String.t()}}, any) ::
          {:ok, %Source{}} | {:error, String.t()}
  def create_source(_root, %{source: inputs} = _args, _info) do
    case Api.create_(inputs) do
      {:ok, source} ->
        {:ok, source}

      {:error, changeset} ->
        {:error, ResolversUtil.changeset_errors_to_string(changeset)}
    end
  end
end
