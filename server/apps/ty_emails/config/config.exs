use Mix.Config

config :ty_emails, TyEmails.DefaultImpl.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: System.get_env("RESUME_MAKR_SMTP_RELAY"),
  username: System.get_env("RESUME_MAKR_SMTP_USER"),
  password: System.get_env("RESUME_MAKR_SMTP_PASS"),
  tls: :always,
  auth: :always,
  port: (System.get_env("RESUME_MAKR_SMTP_PORT") || "0") |> String.to_integer()

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
