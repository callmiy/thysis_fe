defmodule Thysis.Repo.Migrations.SourcesUserProjectNonNull do
  use Ecto.Migration

  def change do
    alter table("sources") do
      modify(:project_id, :integer, null: false)
      modify(:user_id, :integer, null: false)
    end
  end
end
