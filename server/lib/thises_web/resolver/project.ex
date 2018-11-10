defmodule ThysisWeb.Resolver.Project do
  alias Thysis.Projects.Project
  alias Thysis.Projects
  alias ThysisWeb.Resolver

  def create(_root, %{project: attrs}, _info) do
    case Projects.create_(attrs) do
      {:ok, %Project{} = project} ->
        {:ok, project}

      {:error, changeset} ->
        {:error, Resolver.changeset_errors_to_string(changeset)}
    end
  end

  def list(_root, _attrs, %{context: %{current_user: user}}),
    do: {:ok, Projects.list(user.id)}

  def list(_, _, _), do: Resolver.unauthorized()

  def get(_root, %{project: %{id: id}}, %{context: %{current_user: user}}) do
    case Projects.get(id, user.id) do
      nil -> {:error, "Unknown project ID: #{id}"}
      project -> {:ok, project}
    end
  end

  def get(_, _, _), do: Resolver.unauthorized()
end
