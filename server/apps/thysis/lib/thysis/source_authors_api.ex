defmodule Thysis.SourceAuthorApi do
  import Ecto.Query, warn: false

  alias Thysis.Repo
  alias Thysis.SourceAuthor

  def delete_(author_ids) when is_list(author_ids) do
    {_, deleted} =
      SourceAuthor
      |> where([s], s.author_id in ^author_ids)
      |> Repo.delete_all(returning: [:author_id])

    Enum.map(deleted, & &1.author_id)
  end
end
