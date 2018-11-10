defmodule Thysis.Repo.Migrations.TagTextUnique do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;")

    alter table("tags") do
      modify(:text, :citext, null: false)
    end

    execute("""
    CREATE UNIQUE INDEX tags_text ON tags (lower(text));
    """)
  end
end
