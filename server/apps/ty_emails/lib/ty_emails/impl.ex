defmodule TyEmails.Impl do
  @moduledoc false

  @callback send_welcome(TyEmails.email_address()) :: :ok
  @callback send_password_recovery(
              TyEmails.email_address(),
              token :: binary()
            ) :: :ok
end
