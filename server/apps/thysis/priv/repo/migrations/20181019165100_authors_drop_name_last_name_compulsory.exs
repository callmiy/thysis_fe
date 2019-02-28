defmodule Thysis.Repo.Migrations.AuthorsDropNameLastNameCompulsory do
  use Ecto.Migration

  def change do
    alter table(:authors) do
      modify(:last_name, :string, null: false, comment: "Author's last name")
      remove(:name)
    end
  end
end
