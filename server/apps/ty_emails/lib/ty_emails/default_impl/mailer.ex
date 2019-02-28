defmodule TyEmails.DefaultImpl.Mailer do
  @moduledoc false
  use Swoosh.Mailer, otp_app: :ty_emails
end
