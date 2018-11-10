defmodule Thysis.Repo.Migrations.UserNameUniquenessSourceType do
  use Ecto.Migration

  def change do
    alter table("source_types") do
      add(:user_id, references(:users, on_delete: :delete_all))
    end

    :source_types
    |> unique_index([:name, :user_id])
  end
end
