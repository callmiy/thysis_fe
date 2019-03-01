# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :thysis, ecto_repos: [Thysis.Repo]

# Configures the endpoint
config :thysis, ThysisWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "P03sJpvcH4I94Sh1CsEXXpxuvtFzJPxQ1FsFjc/eze4omKteoCcEOQMW8CMbifDs",
  render_errors: [view: ThysisWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Thysis.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "###### $time $metadata[$level] $message\n",
  metadata: [:request_id]

config :absinthe, schema: ThysisWeb.Schema

config :ex_admin,
  repo: Thysis.Repo,
  module: ThysisWeb,
  modules: [
    ThysisWeb.ExAdmin.Dashboard,
    ThysisWeb.ExAdmin.SourceType,
    ThysisWeb.ExAdmin.Source,
    ThysisWeb.ExAdmin.Quote,
    ThysisWeb.ExAdmin.Tag,
    ThysisWeb.ExAdmin.QuoteTag,
    ThysisWeb.ExAdmin.Author,
    ThysisWeb.ExAdmin.Project,
    ThysisWeb.ExAdmin.User
  ]

config :thysis, ThysisWeb.Auth.Guardian,
  issuer: "thysis",
  secret_key: "18mCuUrkr04Qd3hwHrLGAVzs6cxVZT3tNXtmkH8MvFJUOUD2LFh6sajhuFtPlvhm"

config :thysis, ThysisWeb.Auth.AccessPipeline,
  module: ThysisWeb.Auth.Guardian,
  error_handler: ThysisWeb.Auth.Guardian

port = System.get_env("THYSIS_FRONT_END_PORT") || "3016"
config :thysis, front_end_url: "http://localhost:" <> port

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

config :xain, :after_callback, {Phoenix.HTML, :raw}
