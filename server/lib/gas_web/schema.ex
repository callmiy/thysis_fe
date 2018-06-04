defmodule GasWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(GasWeb.Schema.Types)
  import_types(GasWeb.TagSchema)
  import_types(GasWeb.SourceTypeSchema)
  import_types(GasWeb.SourceSchema)
  import_types(GasWeb.QuoteSchema)

  query do
    import_fields(:tag_query)
    import_fields(:source_type_query)
    import_fields(:source_query)
  end

  mutation do
    import_fields(:quote_mutation)
    import_fields(:tag_mutation)
    import_fields(:source_mutation)
  end
end