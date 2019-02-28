defmodule Thysis.Repo.Migrations.CreateQuotes do
  use Ecto.Migration

  def change do
    create table(:quotes) do
      add(:date, :date, null: false)
      add(:page_start, :integer, null: false)
      add(:page_end, :integer)
      add(:text, :string, null: false)

      add(
        :source_id,
        references(:sources, on_delete: :delete_all),
        null: false
      )

      timestamps()
    end

    create(index(:quotes, [:source_id]))
  end
end
