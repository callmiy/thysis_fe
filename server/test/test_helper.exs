{:ok, _} = Application.ensure_all_started(:ex_machina)
Absinthe.Test.prime(GasWeb.Schema)

ExUnit.start(exclude: [norun: true])
Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, :manual)
