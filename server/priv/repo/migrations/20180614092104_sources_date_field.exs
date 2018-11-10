defmodule Thysis.Repo.Migrations.SourcesDateField do
  use Ecto.Migration

  def change do
    alter table("sources") do
      add(:year, :string)
    end
  end
end
