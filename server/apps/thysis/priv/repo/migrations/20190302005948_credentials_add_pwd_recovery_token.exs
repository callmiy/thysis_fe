defmodule Thysis.Repo.Migrations.CredentialsAddPwdRecoveryToken do
  use Ecto.Migration

  def change do
    alter table(:credentials) do
      add(:pwd_recovery_token, :text)
      add(:pwd_recovery_token_expires_at, :utc_datetime)
    end
  end
end
