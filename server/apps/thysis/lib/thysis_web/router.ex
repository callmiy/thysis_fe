defmodule ThysisWeb.Router do
  use ThysisWeb, :router
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
    plug(ThysisWeb.Auth.AccessPipeline)
    plug(ThysisWeb.Plug.AuthContexts)
  end

  scope "/admin", ExAdmin do
    pipe_through(:browser)
    admin_routes()
  end

  scope "/" do
    pipe_through(:api)

    forward(
      "/api",
      Absinthe.Plug,
      schema: ThysisWeb.Schema,
      context: %{pubsub: ThysisWeb.Endpoint}
    )

    if Mix.env() == :dev do
      forward(
        "/graphql",
        Absinthe.Plug.GraphiQL,
        schema: ThysisWeb.Schema,
        context: %{pubsub: ThysisWeb.Endpoint}
      )
    end
  end
end
