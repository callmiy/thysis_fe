use Mix.Config

config :ty_emails, TyEmails.DefaultImpl.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: System.get_env("THYSIS_MAKR_SMTP_RELAY"),
  username: System.get_env("THYSIS_MAKR_SMTP_USER"),
  password: System.get_env("THYSIS_MAKR_SMTP_PASS"),
  tls: :always,
  auth: :always,
  port: System.get_env("THYSIS_MAKR_SMTP_PORT") |> String.to_integer()
