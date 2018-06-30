use Mix.Config

app_port = System.get_env("GAS_PHOENIX_INTEGRATION_TEST_PORT") || 4017

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :gas, GasWeb.Endpoint,
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
  timeout: 60_000,
  pool_timeout: 60_000,
  ownership_timeout: 60_000

config :hound,
  driver: "chrome_driver",
  app_host: "http://localhost",
  app_port: app_port,
  retry_time: 5_000,
  genserver_timeout: 480_000
