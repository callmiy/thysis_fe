defmodule MyExpWeb.Plug.Frontend do
  # all paths not beginning with __ or has filename will be served from frontend
  @pattern ~r/^\/__.*$|^\/.+\.[^\.]+$/
  @path_info ["index.html"]
  @request_path "/index.html"

  @doc false
  def init(opts), do: opts

  @doc false
  def call(conn, _opts) do
    case String.match?(conn.request_path, @pattern) do
      true ->
        conn

      _ ->
        %{
          conn
          | path_info: @path_info,
            request_path: @request_path
        }
    end
  end
end
