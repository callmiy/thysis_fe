defmodule ThysisWeb.Resolver.Source do
  @moduledoc """
  A resolver for the source schema
  """

  import Absinthe.Resolution.Helpers, only: [on_load: 2]

  alias Thysis.Sources.Source
  alias Thysis.Sources
  alias ThysisWeb.Resolver

  @doc """
  Get all sources.
  """

  def sources(_root, %{source: params}, %{context: %{current_user: user}}) do
    {:ok, Sources.list(Map.put(params, :user_id, user.id))}
  end

  def sources(root, params, info),
    do: sources(root, Map.put(params, :source, %{}), info)

  @doc """
  Get one source.
  """

  def source(_, %{source: params}, %{context: %{current_user: user}}) do
    case params
         |> Map.put(:user_id, user.id)
         |> Sources.get() do
      %Source{} = source_ ->
        {:ok, source_}

      nil ->
        {:error, "No source with id: #{params.id} or user unauthorized"}
    end
  end

  def source(_, _, _) do
    {:error, "Unauthorized"}
  end

  @doc """
  Source.to_string
  """
  @spec display(%Source{}, any, any) :: any
  def display(%Source{} = source, _, %{context: %{loader: loader}}) do
    loader
    |> Dataloader.load(Sources, :authors, source)
    |> on_load(fn loader ->
      authors = Dataloader.get(loader, Sources, :authors, source)

      display = %{source | authors: authors} |> Sources.display()

      {:ok, display}
    end)

    # {:ok, Sources.display(source)}
  end

  def create(_, %{source: inputs}, %{context: %{current_user: user}}) do
    with {:ok, %{source: source}} <-
           Sources.create_(
             Map.put(
               inputs,
               :user_id,
               user.id
             )
           ) do
      {:ok, source}
    else
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

  def create(_, _, _) do
    {:error, "Unauthorized"}
  end

  def update(_, %{source: %{id: id} = inputs}, %{context: %{current_user: user}}) do
    case Sources.get(id) do
      nil ->
        {:error, "No source with id: #{id}"}

      source ->
        if user.id == source.user_id do
          update_source(source, inputs)
        else
          {:error, "Unauthorized"}
        end
    end
  end

  defp update_source(source, %{} = inputs) do
    case Sources.update_(source, inputs) do
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
