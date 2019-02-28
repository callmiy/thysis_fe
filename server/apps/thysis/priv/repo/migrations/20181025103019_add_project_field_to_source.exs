defmodule Thysis.Repo.Migrations.ProjectUniquenessSource do
  use Ecto.Migration

  def up do
    alter table("sources") do
      add(:project_id, :integer)
      add(:user_id, :integer)
    end

    execute("""
    ALTER TABLE sources
    ADD CONSTRAINT sources_project_id_user_id_fk
    FOREIGN KEY (project_id, user_id) REFERENCES projects (id, user_id)
    ON DELETE CASCADE
    """)

    :sources
    |> unique_index([:topic, :year, :publication, :url, :user_id])
    |> create()
  end

  def down do
    :sources
    |> index([:topic, :year, :publication, :url, :user_id])
    |> drop()

    execute("""
    ALTER TABLE sources
    DROP CONSTRAINT sources_project_id_user_id_fk
    """)

    remove(:project_id)
    remove(:user_id)
  end
end
