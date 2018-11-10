defmodule ThysisWeb.TagResolver do
  @moduledoc """
  A resolver for the tag schema
  """
  alias Thysis.Tag
  alias Thysis.TagApi, as: Api
  alias ThysisWeb.Resolver

  @doc """
  Get a single tag either by tag text or id or both.
  """
  @spec tag(any, %{tag: %{id: nil | String.t() | integer, text: nil | String.t()}}, any) ::
          {:ok, %Tag{}} | {:error, message: String.t()}
  def tag(_root, %{tag: get_tag_params} = _args, _info) do
    case Api.get_tag_by(get_tag_params) do
      %Tag{} = tag -> {:ok, tag}
      nil -> {:error, message: "tag does not exist."}
    end
  end

  @doc """
  Get all existing tags.
  """
  @spec tags(any, any, any) :: {:ok, [%Tag{}]}
  def tags(_root, _args, _info) do
    {:ok, Api.list()}
  end

  @doc """
  Create a tag
  """
  @spec create_tag(any, %{tag: %{text: String.t()}}, any) :: {:ok, %Tag{}} | {:error, String.t()}
  def create_tag(_root, %{tag: input} = _args, _info) do
    case Api.create_(input) do
      {:ok, tag} ->
        {:ok, tag}

      {:error, changeset} ->
        {:error, Resolver.changeset_errors_to_string(changeset)}
    end
  end
end
