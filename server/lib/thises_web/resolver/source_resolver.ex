defmodule ThisesWeb.SourceResolver do
  @moduledoc """
  A resolver for the source schema
  """

  import Absinthe.Resolution.Helpers, only: [on_load: 2]

  alias Thises.Source
  alias Thises.SourceApi, as: Api
  alias ThisesWeb.Resolver

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
  Source.to_string
  """
  @spec display(%Source{}, any, any) :: any
  def display(%Source{} = source, _, %{context: %{loader: loader}}) do
    loader
    |> Dataloader.load(Api, :authors, source)
    |> on_load(fn loader ->
      authors = Dataloader.get(loader, Api, :authors, source)

      display = %{source | authors: authors} |> Api.display()

      {:ok, display}
    end)

    # {:ok, Api.display(source)}
  end

  @doc """
  Create a source
  """
  @spec create(any, %{source: Map.t()}, any) :: {:ok, %Source{}} | {:error, String.t()}
  def create(_root, %{source: inputs} = _args, _info) do
    case Api.create_(inputs) do
      {:ok, %{source: source}} ->
        {:ok, source}

      {:error, failed_operation, changeset, _success} ->
        {
          :error,
          Resolver.transaction_errors_to_string(
            changeset,
            failed_operation
          )
        }
    end
  end

  @doc """
  Create a source
  """
  @spec update(any, %{source: %{id: Integer.t() | String.t()}}, any) ::
          {:ok, %Source{}} | {:error, String.t()}
  def update(_root, %{source: %{id: id} = inputs} = _args, _info) do
    case Api.get(id) do
      nil ->
        {:error, "No source with id: #{id}"}

      source ->
        case Api.update_(source, inputs) do
          {:ok, %{source: source}} ->
            {:ok, source}

          {:error, failed_operation, changeset, _success} ->
            {
              :error,
              Resolver.transaction_errors_to_string(
                changeset,
                failed_operation
              )
            }
        end
    end
  end
end
