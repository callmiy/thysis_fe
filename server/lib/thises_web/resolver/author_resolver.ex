defmodule ThisesWeb.AuthorResolver do
  @moduledoc """
  A resolver for the author schema
  """
  alias Thises.Author
  alias Thises.AuthorApi, as: Api
  alias ThisesWeb.Resolver

  @doc """
  Get a single author either by author name or id or both.
  """
  @spec author(any, %{author: %{id: nil | String.t() | integer, text: nil | String.t()}}, any) ::
          {:ok, %Author{}} | {:error, message: String.t()}
  def author(_root, %{author: get_author_params} = _args, _info) do
    case Api.get_author_by(get_author_params) do
      %Author{} = author -> {:ok, author}
      nil -> {:error, message: "author does not exist."}
    end
  end

  @doc """
  Get all existing authors.
  """
  @spec authors(any, any, any) :: {:ok, [%Author{}]}
  def authors(_root, _args, _info) do
    {:ok, Api.list()}
  end

  @doc """
  Create an author
  """
  @spec create_author(any, %{author: %{name: String.t()}}, any) ::
          {:ok, %Author{}} | {:error, String.t()}
  def create_author(_root, %{author: input} = _args, _info) do
    case Api.create_(input) do
      {:ok, author} ->
        {:ok, author}

      {:error, changeset} ->
        {:error, Resolver.changeset_errors_to_string(changeset)}
    end
  end
end
