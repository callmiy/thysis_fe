defmodule Thysis.Repo.Migrations.SourcesAddFieldsAuthorTopicUrl do
  use Ecto.Migration

  def change do
    alter table("sources") do
      remove(:citation)
      remove(:year)
      add(:author, :string, null: false)
      add(:topic, :string, null: false)
      add(:publication, :string)
      add(:url, :string)
    end
  end
end
