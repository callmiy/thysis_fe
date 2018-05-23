defmodule GasWeb.FrontEnd do
  # all paths beginning with /app will be served from frontend
  @serve_from_frontend "app"

  def init(opts), do: opts

  def call(conn, _opts) do
    case List.first(conn.path_info) do
      nil ->
        redirect_to_index(conn)

      @serve_from_frontend ->
        redirect_to_index(conn)

      _ ->
        conn
    end
  end

  defp redirect_to_index(conn) do
    %{
      conn
      | path_info: ["index.html"],
        request_path: "/index.html"
    }
  end
end
