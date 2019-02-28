defmodule Thysis.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add(
        :_rev,
        :string,
        null: false,
        default: fragment("concat('my_exp_rev_', nextval('users_id_seq'))")
      )

      add(:name, :string, null: false)
      add(:email, :string, null: false)

      timestamps()
    end

    :users
    |> unique_index([:email])
    |> create()
  end
end
