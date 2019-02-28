defmodule Thysis.Repo.Migrations.CreateSources do
  use Ecto.Migration

  def change do
    create table(:sources) do
      add(:year, :integer, null: false)
      add(:citation, :string, null: false)

      add(
        :source_type_id,
        references(:source_types, on_delete: :delete_all),
        null: false
      )

      timestamps()
    end

    create(index(:sources, [:source_type_id]))
  end
end
