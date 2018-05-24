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
  end

  scope "/__admin", ExAdmin do
    pipe_through(:browser)
    admin_routes()
  end
end
