defmodule Thysis.Accounts.UserApi do
  @moduledoc """
  The Account context.
  """

  import Ecto.Query, warn: false
  import ThysisWeb.Schema.Project, only: [projects_query: 1]
  import ThysisWeb.Schema.Author, only: [authors_project_query: 1]
  import ThysisWeb.Schema.Source, only: [sources_project_query: 1]
  import ThysisWeb.Schema.SourceType, only: [source_types_query: 1]
  import ThysisWeb.Schema.Tag, only: [tags_query: 1]

  alias Thysis.Repo
  alias Thysis.Accounts.User
  alias Thysis.Tag

  @doc """
  Returns the list of users.

  ## Examples

      iex> list()
      [%User{}, ...]

  """
  def list do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get(123)
      %User{}

      iex> get(456)
      ** nil

  """
  def get(id), do: Repo.get(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_(%{field: value})
      {:ok, %User{}}

      iex> create_(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.

  ## Examples

      iex> delete_(user)
      {:ok, %User{}}

      iex> delete_(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _params) do
    queryable
  end

  def get_all_user_data(id) do
    user =
      User
      |> where([u], u.id == ^id)
      |> join(:inner, [u], p in assoc(u, :projects))
      |> join(:inner, [u, p], a in assoc(p, :authors))
      |> join(:inner, [u, p], s in assoc(p, :sources))
      |> join(:inner, [u], st in assoc(u, :source_types))
      |> join(:inner, [..., s, _], sa in assoc(s, :authors))
      |> join(:inner, [u, p, a, s, ...], sst in assoc(s, :source_type))
      |> preload(
        [u, p, a, s, st, sa, sst],
        projects: {p, authors: a, sources: {s, authors: sa, source_type: sst}},
        source_types: st
      )
      |> Repo.one()

    projects = user.projects

    [authors, sources] =
      Enum.reduce(projects, [[], []], fn p, [a, s] ->
        authors = p.authors
        sources = p.sources

        [
          [authors | a],
          [sources | s]
        ]
      end)

    %{
      "projects" => projects_query(projects),
      "authorsProject" => authors_project_query(authors),
      "sourcesProject" => sources_project_query(sources),
      "sourceTypes" => source_types_query(user.source_types),
      "tags" => Tag |> Repo.all() |> tags_query()
    }
  end
end
