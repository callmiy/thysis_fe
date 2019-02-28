defmodule Thysis.Repo.Migrations.SourceAuthorFieldNull do
  use Ecto.Migration

  def change do
    alter table("sources") do
      modify(:author, :string, null: true)
    end
  end
end
