defmodule GasWeb.Router do
  use GasWeb, :router

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

  scope "/__api", GasWeb do
    pipe_through(:api)

    resources("/source_types", SourceTypeController, except: [:new, :edit])
    resources("/sources", SourceController, except: [:new, :edit])
    resources("/quotes", QuoteController, except: [:new, :edit])
  end
end
