defmodule Thysis.Repo.Migrations.CreateTags do
  use Ecto.Migration

  def change do
    create table(:tags) do
      add(:text, :string, null: false)

      timestamps()
    end
  end
end
