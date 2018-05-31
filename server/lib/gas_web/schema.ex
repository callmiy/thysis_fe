defmodule GasWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(GasWeb.Schema.Types)
  import_types(GasWeb.TagSchema)

  query do
    import_fields(:tag_query)
  end

  # mutation do
  #   import_fields(:tag_mutation)
  # end
end
