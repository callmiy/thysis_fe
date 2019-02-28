defmodule Thysis.FeatureCase do
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

  @chrome_driver "chrome_driver"

  using do
    quote do
      use Hound.Helpers

      import Ecto
      import Ecto.Changeset
      import Thysis.FeatureCase
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Thysis.Repo)
    parent = self()

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Thysis.Repo, {:shared, parent})
    end

    # metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Thysis.Repo, self())

    # user_agent =
    #   Hound.Browser.user_agent(:chrome)
    #   |> Hound.Metadata.append(metadata)

    session_opts = setup_browser(tags, @chrome_driver)
    _session_id = Hound.start_session(session_opts)

    on_exit(fn ->
      Hound.end_session(parent)
    end)

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

  @doc """
  Execute the function repeatedly until either the condition is met or number
  of trials is reached.

      assert await(true, fn  -> 1 == 1 end, 5_000 )
  """
  def await(condition, fun, times \\ 5)
  def await(_condition, fun, 0), do: fun.()

  def await(condition, fun, times) when times > 0 do
    case condition == fun.() do
      true ->
        condition

      _ ->
        await(condition, fun, times - 1)
    end
  end

  defp setup_browser(tags, @chrome_driver) do
    chrome_args = [
      # "--user-agent=#{user_agent}"
      "--disable-gpu"
      # ~s(--window-size=#{tags[:window_size] || "360,500"})
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

    [
      additional_capabilities: additional_capabilities
    ]
  end

  defp setup_browser(_tags, _is_chrome), do: []
end
