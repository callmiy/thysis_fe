defmodule Mix.Tasks.Deploy do
  use Mix.Task

  @shortdoc ~S"""
  Tasks for managing deployment of thysis app
  """

  @static_folder Path.expand("priv/web-client")
  @index_html "index.html"

  @spec run([String.t(), ...]) :: :ok
  def run(args), do: deploy(args)

  def deploy(["rewrite", @index_html]) do
    Mix.Task.run("phx.digest", [@static_folder])
  end
end
