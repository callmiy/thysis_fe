defmodule Thysis.Mixfile do
  use Mix.Project

  def project do
    [
      app: :thysis,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.8",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      compilers: [:phoenix, :gettext] ++ Mix.compilers()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Thysis.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:dev), do: ["lib", "lib_dev"]
  defp elixirc_paths(:test), do: elixirc_paths(:dev) ++ ["test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.3.0"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_ecto, "~> 3.2"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 2.10"},
      {:gettext, "~> 0.13.1"},
      {:plug_cowboy, "~> 1.0"},
      {:absinthe, "~> 1.4"},
      {:ex_machina, "~> 2.2", only: [:dev, :test]},
      {:ex_admin, github: "smpallen99/ex_admin"},
      {:timex, "~> 3.3"},
      {:timex_ecto, "~> 3.3"},
      {:absinthe_plug, "~> 1.4"},
      {:faker, "~> 0.10.0", only: [:dev, :test]},
      {:corsica, "~> 1.1"},
      {:hound, "~> 1.0", only: [:test]},
      {:dataloader, "~> 1.0"},
      {:guardian, "~> 1.1"},
      {:bcrypt_elixir, "~> 1.1"},
      {:comeonin, "~> 4.1"},
      {:ty_emails, in_umbrella: true}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
