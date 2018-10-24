defmodule GasWeb.Router do
  use GasWeb, :router
  use ExAdmin.Router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(GasWeb.Auth.AccessPipeline)
    plug(GasWeb.Plug.AuthContexts)
  end

  scope "/__admin", ExAdmin do
    pipe_through(:browser)
    admin_routes()
  end

  scope "/" do
    pipe_through(:api)

    forward(
      "/__api",
      Absinthe.Plug,
      schema: GasWeb.Schema,
      context: %{pubsub: GasWeb.Endpoint}
    )

    if Mix.env() == :dev do
      forward(
        "/__graphql",
        Absinthe.Plug.GraphiQL,
        schema: GasWeb.Schema,
        context: %{pubsub: GasWeb.Endpoint}
      )
    end
  end
end
