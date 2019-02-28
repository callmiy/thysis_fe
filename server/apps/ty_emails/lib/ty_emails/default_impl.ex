defmodule TyEmails.DefaultImpl do
  @moduledoc false

  alias TyEmails.DefaultImpl.Mailer
  alias TyEmails.DefaultImpl.Composition

  @behaviour TyEmails.Impl

  @type email_address :: TyEmails.email_address()

  @impl true
  @spec send_welcome(email_address) :: :ok
  def send_welcome(email_address) do
    email_address |> Composition.welcome() |> Mailer.deliver()
    :ok
  end

  @impl true
  @spec send_password_recovery(email_address, token :: binary()) :: :ok
  def send_password_recovery(email_address, token) do
    email_address
    |> Composition.password_recovery(token)
    |> Mailer.deliver()

    :ok
  end
end
