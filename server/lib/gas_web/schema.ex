defmodule GasWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(GasWeb.Schema.Types)
  import_types(GasWeb.TagSchema)
  import_types(GasWeb.SourceTypeSchema)
  import_types(GasWeb.SourceSchema)

  query do
    import_fields(:tag_query)
    import_fields(:source_type_query)
    import_fields(:source_query)
  end

  # mutation do
  #   import_fields(:tag_mutation)
  # end
end
