defmodule ThysisWeb.DataChannel do
  use ThysisWeb, :channel

  alias Thysis.Accounts.User
  alias Thysis.Accounts.UserApi

  @dialyzer {:no_return, run_query: 2, handle_in: 3}

  alias ThysisWeb.Schema

  @doc ~S"""
    Channel "data:pxy" = un-authenticated channel
  """

  def join("data:pxy", _params, socket), do: {:ok, socket}

  def join("data:pxz", _params, socket) do
    user = socket.assigns[:user]

    if can_join?(user) do
      {:ok, UserApi.get_all_user_data(user.id), socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @doc false
  def handle_in("graphql:pxy", params, socket) do
    run_query(params, socket)
  end

  @doc false
  def handle_in("graphql:pxz", params, socket) do
    run_query(params, socket)
  end

  defp run_query(%{"query" => query} = params, socket) do
    response =
      case Absinthe.run(
             query,
             Schema,
             variables: params["variables"] || %{},
             context: %{current_user: socket.assigns[:user]}
           ) do
        {:ok, %{errors: errors}} ->
          {:error, %{errors: errors}}

        {:ok, %{data: data}} ->
          {:ok, data}
      end

    {:reply, response, socket}
  end

  defp can_join?(user) do
    case user do
      %User{} -> true
      _ -> false
    end
  end
end
