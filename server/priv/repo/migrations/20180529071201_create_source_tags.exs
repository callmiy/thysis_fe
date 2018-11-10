defmodule Thysis.Repo.Migrations.CreateQuoteTags do
  use Ecto.Migration

  def change do
    create table(:quote_tags) do
      add(:quote_id, references(:quotes, on_delete: :nothing), null: false)
      add(:tag_id, references(:tags, on_delete: :nothing), null: false)

      timestamps()
    end

    create(index(:quote_tags, [:quote_id]))
    create(index(:quote_tags, [:tag_id]))
    create(index(:quote_tags, [:quote_id, :tag_id], unique: true))
  end
end
