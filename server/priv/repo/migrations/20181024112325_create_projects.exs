defmodule Thysis.Repo.Migrations.CreateProjects do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add(:title, :string, null: false, comment: "Title of project")

      add(:user_id, references(:users, on_delete: :delete_all),
        null: false,
        comment: "The owner of the project"
      )

      timestamps()
    end

    # Needed for tables that must be reference projects but unique for user
    # e.g an author belongs to a project, but a user may only define an author
    # once.  Once the author is defined in one project, then user must use this
    # author in subsequent projects and not create a new one
    :projects
    |> unique_index([:id, :user_id])
    |> create()

    :projects
    |> unique_index([:title, :user_id])
    |> create()
  end
end
