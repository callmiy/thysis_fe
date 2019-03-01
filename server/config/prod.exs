use Mix.Config

# Do not print debug messages in production
config :logger,
  level: :info,
  compile_time_purge_level: :info
