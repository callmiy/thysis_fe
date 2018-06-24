defmodule Gas.Factory.SourceStrategy do
  use ExMachina.Strategy, function_name: :insert

  alias Gas.SourceApi
  alias Gas.Source

  def handle_insert(%{source_type_id: nil, source_type: %{id: id}} = record, opts)
      when is_integer(id) do
    %{
      record
      | source_type_id: id
    }
    |> handle_insert(opts)
  end

  def handle_insert(record, _opts) do
    {:ok, %{source: %Source{} = source}} =
      Map.from_struct(record)
      |> SourceApi.create_()

    source
  end
end
