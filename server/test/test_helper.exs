Absinthe.Test.prime(GasWeb.Schema)
Application.ensure_all_started(:hound)
{:ok, _} = Application.ensure_all_started(:ex_machina)

ExUnit.start(exclude: [norun: true, integration: true])
Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, :manual)
