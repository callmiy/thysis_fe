defmodule Thysis.Repo.Migrations.AuthorsUserProjectNonNull do
  use Ecto.Migration

  def change do
    alter table("authors") do
      modify(:project_id, :integer, null: false)
      modify(:user_id, :integer, null: false)
    end
  end
end
