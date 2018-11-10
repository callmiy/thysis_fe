defmodule Mix.Tasks.Deploy do
  use Mix.Task

  @shortdoc ~S"""
  Tasks for managing deployment of thysis app
  """

  @build_static_folder "_build/" <>
                         (System.get_env("MIX_ENV") || "dev") <> "/lib/thysis/priv/web-client"

  @static_folder Path.expand("priv/web-client")
  @cache_manifest_path Path.expand("cache_manifest.json", @static_folder)
  @index_html_path Path.expand("index.html", @static_folder)
  @index_static_pattern ~r{="/(static/.+?)"}
  @index_html "index.html"
  @digests "digests"

  @spec run([String.t(), ...]) :: :ok
  def run(args), do: deploy(args)

  def deploy(["rewrite", @index_html]) do
    Mix.Task.run("phx.digest", [@static_folder])

    cache_manifest =
      @cache_manifest_path
      |> File.read!()
      |> Poison.decode!()

    latest = Map.get(cache_manifest, "latest")

    index_str = File.read!(@index_html_path)

    index_str =
      @index_static_pattern
      |> Regex.scan(index_str)
      |> Enum.reduce(index_str, fn [_a, f], acc ->
        String.replace(acc, f, Map.get(latest, f, ""))
      end)

    index_html_digest = Map.get(latest, @index_html, "")
    latest = Map.delete(latest, @index_html)

    digests =
      cache_manifest
      |> Map.get(@digests, %{})
      |> Map.delete(index_html_digest)

    cache_manifest =
      cache_manifest
      |> Map.merge(%{
        "latest" => latest,
        @digests => digests
      })

    File.write!(@cache_manifest_path, Poison.encode!(cache_manifest))
    File.write!(@index_html_path, index_str)

    [
      index_html_digest,
      index_html_digest <> ".gz",
      @index_html <> ".gz"
    ]
    |> Enum.each(fn p ->
      File.rm!(Path.expand(p, @static_folder))
      File.rm!(Path.expand(p, @build_static_folder))
    end)
  end
end
