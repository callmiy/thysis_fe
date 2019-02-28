defmodule Thysis.Repo.Migrations.CreateSourceTypes do
  use Ecto.Migration

  def change do
    create table(:source_types) do
      add(:name, :string, null: false)
    end
  end
end
