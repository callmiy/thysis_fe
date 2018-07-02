defmodule Gas.FeatureCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      use Wallaby.DSL

      alias Gas.Repo
      alias Gas.Factory.Source, as: SourceFactory
      alias Gas.SourceApi, as: SourceApi
      alias Gas.Author
      alias Gas.Tag
      alias Wallaby.Element, as: El

      import Gas.FeatureCase
      import Ecto
      import Ecto.Changeset
      import Gas.Factory

      import Wallaby.Query,
        only: [
          css: 1,
          css: 2
        ]
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Gas.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Gas.Repo, self())
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    {:ok, session: session}
  end

  @doc """
  A helper that transform changeset errors to a map of messages.

      assert {:error, changeset} = Accounts.create_user(%{password: "short"})
      assert "password is too short" in errors_on(changeset).password
      assert %{password: ["password is too short"]} = errors_on(changeset)

  """
  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Enum.reduce(opts, message, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end

  def await(condition, fun, trials \\ 0)
  def await(_condition, fun, 0), do: fun.()

  def await(condition, fun, trials) when trials > 0 do
    case condition == fun.() do
      true -> condition
      _ -> await(condition, fun, trials - 1)
    end
  end
end
