Absinthe.Test.prime(ThisesWeb.Schema)
Application.ensure_all_started(:hound)
{:ok, _} = Application.ensure_all_started(:ex_machina)

ExUnit.start(exclude: [integration: true])
Ecto.Adapters.SQL.Sandbox.mode(Thises.Repo, :manual)
