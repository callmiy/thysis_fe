use Mix.Config

app_port = System.get_env("GAS_PHOENIX_INTEGRATION_TEST_PORT") || 4017

config :gas, :sql_sandbox, true

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :gas, GasWeb.Endpoint,
  url: [host: "localhost"],
  http: [port: app_port],
  server: true

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :gas, Gas.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "gas_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox,
  timeout: 600_000,
  pool_timeout: 600_000,
  ownership_timeout: 600_000

config :wallaby,
  driver: Wallaby.Experimental.Chrome,
  chrome: [
    # headless: false
  ]
