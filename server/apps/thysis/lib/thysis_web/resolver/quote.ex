defmodule ThysisWeb.Resolver.Quote do
  @moduledoc """
  Resolver for the Quote Schema
  """

  alias Thysis.Quote
  alias Thysis.QuoteApi, as: Api
  alias ThysisWeb.Resolver
  alias Thysis.Sources
  # alias Thysis.Sources.Source

  def create_quote(_, %{quote: inputs}, %{context: %{current_user: _user}}) do
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

  def create_quote(_, _, _), do: Resolver.unauthorized()

  def quotes(_, args, %{context: %{current_user: _user}}) do
    {:ok, Api.get_quotes_by(Map.get(args, :quote))}
  end

  def quote(_, %{quote: %{id: id}}, %{context: %{current_user: _user}}) do
    case Api.get(id) do
      nil -> {:error, "No quote exists for id: #{id}"}
      quote_ -> {:ok, quote_}
    end
  end

  def quote(_, _, _), do: Resolver.unauthorized()

  def full_text_search(_, %{text: %{text: text}}, %{context: %{current_user: _user}}) do
    {:ok, Api.full_text_search(text)}
  end

  def full_text_search(_, _, _), do: Resolver.unauthorized()

  def source(%Quote{source_id: id}, _, %{context: %{current_user: _user}}) do
    case Sources.get(id) do
      nil -> {:error, "No quote source with ID: #{id}"}
      source -> {:ok, source}
    end
  end

  def source(_, _, _), do: Resolver.unauthorized()
end
