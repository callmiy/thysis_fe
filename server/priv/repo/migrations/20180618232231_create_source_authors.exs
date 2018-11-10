defmodule Thysis.Repo.Migrations.CreateSourceAuthors do
  use Ecto.Migration

  def change do
    create table(:source_authors) do
      add(:author_id, references(:authors, on_delete: :nothing), null: false)
      add(:source_id, references(:sources, on_delete: :nothing), null: false)

      timestamps()
    end

    create(index(:source_authors, [:author_id]))
    create(index(:source_authors, [:source_id]))
    create(index(:source_authors, [:author_id, :source_id], unique: true))
  end
end
