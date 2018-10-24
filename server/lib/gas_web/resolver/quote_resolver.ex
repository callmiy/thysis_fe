defmodule GasWeb.QuoteResolver do
  @moduledoc """
  Resolver for the Quote Schema
  """

  alias Gas.Quote
  alias Gas.QuoteApi, as: Api
  alias GasWeb.Resolver
  alias Gas.SourceApi
  alias Gas.Source

  @doc """
  Create a quote
  """
  @spec create_quote(any, %{quote: Map.t()}, any) :: {:ok, %Quote{}} | {:error, String.t()}
  def create_quote(_root, %{quote: inputs}, _info) do
    case Api.create_with_tags(inputs) do
      {:ok, %{quote: quote_}} ->
        {:ok, quote_}

      {:error, failed_operation, changeset, _success} ->
        {
          :error,
          Resolver.transaction_errors_to_string(
            changeset,
            failed_operation
          )
        }
    end
  end

  @spec quotes(any, %{}, any) :: {:ok, [%Quote{}]} | {:error, String.t()}
  def quotes(_root, args, _info) do
    {:ok, Api.get_quotes_by(Map.get(args, :quote))}
  end

  def quote(_roots, %{quote: %{id: id}}, _info) do
    case Api.get(id) do
      nil -> {:error, "No quote exists for id: #{id}"}
      quote_ -> {:ok, quote_}
    end
  end

  def full_text_search(_root, %{text: %{text: text}}, _info) do
    {:ok, Api.full_text_search(text)}
  end

  @spec source(%Quote{source_id: Integer.t()}, any, any) ::
          {:ok, [%Source{}]} | {:error, String.t()}
  def source(%Quote{source_id: id}, _, _) do
    case SourceApi.get(id) do
      nil -> {:error, "No quote source with ID: #{id}"}
      source -> {:ok, source}
    end
  end
end
