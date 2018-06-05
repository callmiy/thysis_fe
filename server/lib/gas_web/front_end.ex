defmodule GasWeb.FrontEnd do
  # all paths not beginning with __ or has filename will be served from frontend
  @pattern ~r/^\/__.*$|^\/.+\.[^\.]+$/

  def init(opts), do: opts

  def call(conn, _opts) do
    case String.match?(conn.request_path, @pattern) do
      true ->
        conn

      _ ->
        %{
          conn
          | path_info: ["index.html"],
            request_path: "/index.html"
        }
    end
  end
end
