Absinthe.Test.prime(ThysisWeb.Schema)
Application.ensure_all_started(:hound)
{:ok, _} = Application.ensure_all_started(:ex_machina)

ExUnit.start(exclude: [integration: true])
Ecto.Adapters.SQL.Sandbox.mode(Thysis.Repo, :manual)
