# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :gas, ecto_repos: [Gas.Repo]

# Configures the endpoint
config :gas, GasWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "P03sJpvcH4I94Sh1CsEXXpxuvtFzJPxQ1FsFjc/eze4omKteoCcEOQMW8CMbifDs",
  render_errors: [view: GasWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Gas.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :ex_admin,
  repo: Gas.Repo,
  module: GasWeb,
  modules: [
    GasWeb.ExAdmin.Dashboard,
    GasWeb.ExAdmin.SourceType,
    GasWeb.ExAdmin.Source,
    GasWeb.ExAdmin.Quote,
    GasWeb.ExAdmin.Tag
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :xain, :after_callback, {Phoenix.HTML, :raw}
