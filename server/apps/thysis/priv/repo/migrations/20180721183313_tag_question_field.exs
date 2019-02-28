defmodule Thysis.Repo.Migrations.TagQuestionField do
  use Ecto.Migration

  def change do
    alter table("tags") do
      add(:question, :string)
    end
  end
end
