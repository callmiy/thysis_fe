defmodule ThysisWeb.Resolver.Author do
  @moduledoc """
  A resolver for the author schema
  """
  alias Thysis.Author
  alias Thysis.AuthorApi, as: Api
  alias ThysisWeb.Resolver

  def author(_, %{author: params}, %{context: %{current_user: user}}) do
    case params
         |> Map.put(:user_id, user.id)
         |> Api.get_author_by() do
      %Author{} = author -> {:ok, author}
      nil -> {:error, message: "author does not exist."}
    end
  end

  def author(_, _, _), do: Resolver.unauthorized()

  def authors(_, args, %{context: %{current_user: user}}) do
    {:ok,
     Api.list(
       args
       |> Map.get(:author, %{})
       |> Map.put(:user_id, user.id)
     )}
  end

  def authors(_, _, _), do: Resolver.unauthorized()

  def create_author(_, %{author: input}, %{context: %{current_user: user}}) do
    case input
         |> Map.put(:user_id, user.id)
         |> Api.create_() do
      {:ok, author} ->
        {:ok, author}

      {:error, changeset} ->
        {:error, Resolver.changeset_errors_to_string(changeset)}
    end
  end

  def create_author(_, _, _), do: Resolver.unauthorized()

  def update(_, %{author: %{id: id} = input}, %{context: %{current_user: user}}) do
    case Api.get(id, user.id) do
      nil ->
        {:error, "Unknown author"}

      author ->
        case Api.update_(author, Map.delete(input, :id)) do
          {:ok, author} ->
            {:ok, author}

          {:error, changeset} ->
            {:error, Resolver.changeset_errors_to_string(changeset)}
        end
    end
  end

  def update(_, _, _), do: Resolver.unauthorized()
end
