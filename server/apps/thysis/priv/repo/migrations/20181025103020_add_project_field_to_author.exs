defmodule Thysis.Repo.Migrations.AddProjectAndUserToAuthor do
  use Ecto.Migration

  def up do
    alter table("authors") do
      add(:project_id, :integer)
      add(:user_id, :integer)
    end

    execute("""
    ALTER TABLE authors
    ADD CONSTRAINT authors_project_id_user_id_fk
    FOREIGN KEY (project_id, user_id) REFERENCES projects (id, user_id)
    ON DELETE CASCADE
    """)

    :authors
    |> unique_index([:first_name, :middle_name, :last_name, :user_id])
    |> create()
  end

  def down do
    "authors"
    |> index([:first_name, :middle_name, :last_name, :user_id])
    |> drop()

    execute("""
    ALTER TABLE authors
    DROP CONSTRAINT authors_project_id_user_id_fk
    """)

    remove(:project_id)
    remove(:user_id)
  end
end
