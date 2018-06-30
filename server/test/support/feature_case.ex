defmodule Gas.FeatureCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      use Hound.Helpers

      alias Gas.Repo
      alias Gas.Factory.Source, as: SourceFactory

      import Ecto
      import Ecto.Changeset
      import Gas.Factory
      import Gas.FeatureCase
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Gas.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Gas.Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Iclog.Repo, self())

    user_agent =
      Hound.Browser.user_agent(:chrome)
      |> Hound.Metadata.append(metadata)

    chrome_args = [
      "--user-agent=#{user_agent}",
      "--disable-gpu"
    ]

    chrome_args =
      unless tags[:no_headless] do
        ["--headless" | chrome_args]
      else
        chrome_args
      end

    additional_capabilities = %{
      chromeOptions: %{"args" => chrome_args}
    }

    Hound.start_session(
      metadata: metadata,
      additional_capabilities: additional_capabilities
    )

    parent = self()
    on_exit(fn -> Hound.end_session(parent) end)

    :ok
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
end
