defmodule Thysis.Repo.Migrations.AddFirstMiddleLastNamesToAuthor do
  use Ecto.Migration

  def change do
    alter table(:authors) do
      modify(:name, :string, null: true)
      add(:first_name, :string, null: true, comment: "Author's first name")
      add(:last_name, :string, null: true, comment: "Author's last name")
      add(:middle_name, :string, null: true, comment: "Author's middle name")
    end
  end
end
