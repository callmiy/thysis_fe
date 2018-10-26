defmodule ThisesWeb.Resolver.Author do
  @moduledoc """
  A resolver for the author schema
  """
  alias Thises.Author
  alias Thises.AuthorApi, as: Api
  alias ThisesWeb.Resolver

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
end
