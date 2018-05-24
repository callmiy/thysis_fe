{:ok, _} = Application.ensure_all_started(:ex_machina)
ExUnit.start(exclude: [norun: true])
Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, :manual)
