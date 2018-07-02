Absinthe.Test.prime(GasWeb.Schema)
{:ok, _} = Application.ensure_all_started(:wallaby)
Application.put_env(:wallaby, :base_url, GasWeb.Endpoint.url())
Application.ensure_all_started(:hound)

ExUnit.start(exclude: [norun: true, integration: true])
Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, :manual)
