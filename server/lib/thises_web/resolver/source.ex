defmodule ThisesWeb.Resolver.Source do
  @moduledoc """
  A resolver for the source schema
  """

  import Absinthe.Resolution.Helpers, only: [on_load: 2]

  alias Thises.Sources.Source
  alias Thises.Sources
  alias ThisesWeb.Resolver
  alias Thises.Projects

  @doc """
  Get all sources.
  """

  def sources(_root, %{source: params}, %{context: %{current_user: user}}) do
    {:ok, Sources.list(params, user.id)}
  end

  def sources(root, params, info),
    do: sources(root, Map.put(params, :source, %{}), info)

  @doc """
  Get one source.
  """

  def source(_, %{source: %{id: id}}, %{context: %{current_user: user}}) do
    case Sources.get(id, user.id) do
      %Source{} = source_ -> {:ok, source_}
      nil -> {:error, "No source with id: #{id} or user unauthorized"}
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

  def create(_, %{source: %{project_id: project_id} = inputs}, %{context: %{current_user: user}}) do
    with :ok <- Projects.owner?(user.id, project_id),
         {:ok, %{source: source}} <- Sources.create_(inputs) do
      {:ok, source}
    else
      :error ->
        {:error, "Unauthorized"}

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

  @doc """
  Create a source
  """
  @spec update(any, %{source: %{id: Integer.t() | String.t()}}, any) ::
          {:ok, %Source{}} | {:error, String.t()}
  def update(_root, %{source: %{id: id} = inputs} = _args, _info) do
    case Sources.get(id) do
      nil ->
        {:error, "No source with id: #{id}"}

      source ->
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
end
