defmodule Thysis.Repo.Migrations.SourceDeleteAuthorField do
  use Ecto.Migration

  def change do
    alter table("sources") do
      remove(:author)
    end
  end
end
