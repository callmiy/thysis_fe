defmodule Gas.Repo.Migrations.CreateProjects do
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

    :projects
    |> unique_index([:title, :user_id])
    |> create()
  end
end
