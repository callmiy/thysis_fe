defmodule GasWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(GasWeb.Schema.Types)
  import_types(GasWeb.TagSchema)
  import_types(GasWeb.SourceTypeSchema)
  import_types(GasWeb.SourceSchema)
  import_types(GasWeb.QuoteSchema)
  import_types(GasWeb.AuthorSchema)
  import_types(GasWeb.Schema.Credential)
  import_types(GasWeb.Schema.User)

  alias Gas.QuoteApi
  alias Gas.TagApi
  alias Gas.SourceApi
  alias Gas.AuthorApi
  alias Gas.SourceTypeApi
  alias Gas.Accounts.CredentialApi
  alias Gas.Accounts.UserApi

  query do
    import_fields(:tag_query)
    import_fields(:source_type_query)
    import_fields(:source_query)
    import_fields(:quote_query)
    import_fields(:author_query)
  end

  mutation do
    import_fields(:quote_mutation)
    import_fields(:tag_mutation)
    import_fields(:author_mutation)
    import_fields(:source_mutation)
    import_fields(:user_mutation)
  end

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(QuoteApi, QuoteApi.data())
      |> Dataloader.add_source(TagApi, TagApi.data())
      |> Dataloader.add_source(SourceApi, SourceApi.data())
      |> Dataloader.add_source(AuthorApi, AuthorApi.data())
      |> Dataloader.add_source(SourceTypeApi, SourceTypeApi.data())
      |> Dataloader.add_source(CredentialApi, CredentialApi.data())
      |> Dataloader.add_source(UserApi, UserApi.data())

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end

  def get_datetime_id(other \\ "")

  def get_datetime_id(other) when is_binary(other),
    do:
      DateTime.utc_now()
      |> DateTime.to_iso8601()
      |> Kernel.<>(other)

  def get_datetime_id(other),
    do:
      other
      |> inspect()
      |> get_datetime_id()
end
