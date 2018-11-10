defmodule Thysis.Projects do
  @moduledoc """
  The Projects context.
  """

  import Ecto.Query, warn: false

  alias Thysis.Repo
  alias Thysis.Projects.Project

  @doc """
  Returns the list of projects.

  ## Examples

      iex> list(345)
      [%Project{}, ...]

  """
  @spec list(user_id :: Integer.t() | String.t()) :: [%Project{}]
  def list(user_id) do
    Project
    |> where([p], p.user_id == ^user_id)
    |> Repo.all()
  end

  @doc """
  Gets a single project for a user.

  Returns `nil` if the Project does not exist for user.

  ## Examples

      iex> get(123, 456)
      %Project{}

      iex> get(456, 678)
      ** nil

  """
  def get(project_id, user_id),
    do:
      Project
      |> where([p], p.id == ^project_id)
      |> where([p], p.user_id == ^user_id)
      |> Repo.one()

  @doc """
  Creates a project.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %Project{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %Project{}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a project.

  ## Examples

      iex> update_(project, %{field: new_value})
      {:ok, %Project{}}

      iex> update_(project, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%Project{} = project, attrs) do
    project
    |> Project.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Project.

  ## Examples

      iex> delete_(project)
      {:ok, %Project{}}

      iex> delete_(project)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%Project{} = project) do
    Repo.delete(project)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking project changes.

  ## Examples

      iex> change_(project)
      %Ecto.Changeset{source: %Project{}}

  """
  def change_(%Project{} = project) do
    Project.changeset(project, %{})
  end

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end
end
