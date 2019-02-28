use Mix.Config

config :ty_emails, TyEmails.DefaultImpl.Mailer, adapter: Swoosh.Adapters.Test

config :constantizer, resolve_at_compile_time: false
