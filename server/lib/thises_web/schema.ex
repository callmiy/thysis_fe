defmodule ThisesWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(ThisesWeb.Schema.Types)
  import_types(ThisesWeb.Schema.Tag)
  import_types(ThisesWeb.Schema.SourceType)
  import_types(ThisesWeb.Schema.Source)
  import_types(ThisesWeb.Schema.Quote)
  import_types(ThisesWeb.Schema.Author)
  import_types(ThisesWeb.Schema.Credential)
  import_types(ThisesWeb.Schema.User)
  import_types(ThisesWeb.Schema.Project)

  alias Thises.QuoteApi
  alias Thises.TagApi
  alias Thises.Sources
  alias Thises.AuthorApi
  alias Thises.SourceTypeApi
  alias Thises.Accounts.CredentialApi
  alias Thises.Accounts.UserApi
  alias Thises.Projects

  query do
    import_fields(:tag_query)
    import_fields(:source_type_query)
    import_fields(:source_query)
    import_fields(:quote_query)
    import_fields(:author_query)
    import_fields(:project_query)
    import_fields(:user_query)
  end

  mutation do
    import_fields(:quote_mutation)
    import_fields(:tag_mutation)
    import_fields(:author_mutation)
    import_fields(:source_mutation)
    import_fields(:user_mutation)
    import_fields(:project_mutation)
    import_fields(:source_type_mutation)
  end

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(QuoteApi, QuoteApi.data())
      |> Dataloader.add_source(TagApi, TagApi.data())
      |> Dataloader.add_source(Sources, Sources.data())
      |> Dataloader.add_source(AuthorApi, AuthorApi.data())
      |> Dataloader.add_source(SourceTypeApi, SourceTypeApi.data())
      |> Dataloader.add_source(CredentialApi, CredentialApi.data())
      |> Dataloader.add_source(UserApi, UserApi.data())
      |> Dataloader.add_source(Projects, Projects.data())

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
