defmodule Thysis.MapHelpers do
  @moduledoc """
  Functions to transform maps
  """

  @doc """
  Convert map string camelCase keys to to_underscore_keys
  """
  def to_underscore_keys(nil), do: nil

  def to_underscore_keys(map = %{}) do
    map
    |> Enum.map(fn {k, v} -> {Macro.underscore(k), to_underscore_keys(v)} end)
    |> Enum.map(fn {k, v} -> {String.replace(k, "-", "_"), v} end)
    |> Enum.into(%{})
  end

  # Walk the list and atomize the keys of
  # of any map members
  def to_underscore_keys([head | rest]) do
    [to_underscore_keys(head) | to_underscore_keys(rest)]
  end

  def to_underscore_keys(not_a_map) do
    not_a_map
  end

  @doc """
  Convert map string keys to :atom keys
  """
  def atomize_keys(nil), do: nil

  # Structs don't do enumerable and anyway the keys are already
  # atoms
  def atomize_keys(struct = %{__struct__: _}), do: struct

  def atomize_keys(map = %{}) do
    map
    |> Enum.map(fn {k, v} -> {String.to_existing_atom(k), atomize_keys(v)} end)
    |> Enum.into(%{})
  end

  # Walk the list and atomize the keys of
  # of any map members
  def atomize_keys([head | rest]) do
    [atomize_keys(head) | atomize_keys(rest)]
  end

  def atomize_keys(not_a_map) do
    not_a_map
  end

  @doc """
  Convert map atom keys to strings
  """
  def stringify_keys(nil), do: nil
  def stringify_keys(%Date{} = date), do: Date.to_iso8601(date)

  def stringify_keys(val = %{__struct__: _}),
    do:
      Map.from_struct(val)
      |> stringify_keys()

  def stringify_keys(val = %{__meta__: meta}) do
    val
    |> Map.delete(:__meta__)
    |> stringify_keys()
    |> Map.put(:__meta__, meta)
  end

  def stringify_keys(struct = %{struct: _}), do: struct
  def stringify_keys(val) when not is_map(val), do: val

  def stringify_keys(map = %{}) do
    map
    |> Enum.map(fn {k, v} ->
      {Atom.to_string(k), stringify_keys(v)}
    end)
    |> Enum.into(%{})
  end

  # Walk the list and stringify the keys of
  # of any map members
  def stringify_keys([head | rest]) do
    [stringify_keys(head) | stringify_keys(rest)]
  end

  @doc """
  Deep merge two maps
  """
  def deep_merge(left, right) do
    Map.merge(left, right, &deep_resolve/3)
  end

  # Key exists in both maps, and both values are maps as well.
  # These can be merged recursively.
  defp deep_resolve(_key, left = %{}, right = %{}) do
    deep_merge(left, right)
  end

  # Key exists in both maps, but at least one of the values is
  # NOT a map. We fall back to standard merge behavior, preferring
  # the value on the right.
  defp deep_resolve(_key, _left, right) do
    right
  end
end
