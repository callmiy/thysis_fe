defmodule Thises.SourceAuthorApi do
  import Ecto.Query, warn: false

  alias Thises.Repo
  alias Thises.SourceAuthor

  def delete_(author_ids) when is_list(author_ids) do
    {_, deleted} =
      SourceAuthor
      |> where([s], s.author_id in ^author_ids)
      |> Repo.delete_all(returning: [:author_id])

    Enum.map(deleted, & &1.author_id)
  end
end
