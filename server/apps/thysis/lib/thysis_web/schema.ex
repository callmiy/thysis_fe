defmodule ThysisWeb.Schema do
  use Absinthe.Schema

  import_types(Absinthe.Type.Custom)
  import_types(ThysisWeb.Schema.Types)
  import_types(ThysisWeb.Schema.Tag)
  import_types(ThysisWeb.Schema.SourceType)
  import_types(ThysisWeb.Schema.Source)
  import_types(ThysisWeb.Schema.Quote)
  import_types(ThysisWeb.Schema.Author)
  import_types(ThysisWeb.Schema.User)
  import_types(ThysisWeb.Schema.Project)

  alias Thysis.QuoteApi
  alias Thysis.TagApi
  alias Thysis.Sources
  alias Thysis.AuthorApi
  alias Thysis.SourceTypeApi
  alias Thysis.Accounts.CredentialApi
  alias Thysis.Accounts.UserApi
  alias Thysis.Projects

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
end
