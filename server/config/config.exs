# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :thises, ecto_repos: [Thises.Repo]

# Configures the endpoint
config :thises, ThisesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "P03sJpvcH4I94Sh1CsEXXpxuvtFzJPxQ1FsFjc/eze4omKteoCcEOQMW8CMbifDs",
  render_errors: [view: ThisesWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Thises.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :absinthe, schema: ThisesWeb.Schema

config :ex_admin,
  repo: Thises.Repo,
  module: ThisesWeb,
  modules: [
    ThisesWeb.ExAdmin.Dashboard,
    ThisesWeb.ExAdmin.SourceType,
    ThisesWeb.ExAdmin.Source,
    ThisesWeb.ExAdmin.Quote,
    ThisesWeb.ExAdmin.Tag,
    ThisesWeb.ExAdmin.QuoteTag,
    ThisesWeb.ExAdmin.Author,
    ThisesWeb.ExAdmin.Project,
    ThisesWeb.ExAdmin.User
  ]

config :thises, ThisesWeb.Auth.Guardian,
  issuer: "thises",
  secret_key: "18mCuUrkr04Qd3hwHrLGAVzs6cxVZT3tNXtmkH8MvFJUOUD2LFh6sajhuFtPlvhm"

config :thises, ThisesWeb.Auth.AccessPipeline,
  module: ThisesWeb.Auth.Guardian,
  error_handler: ThisesWeb.Auth.Guardian

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :xain, :after_callback, {Phoenix.HTML, :raw}
