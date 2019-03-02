defmodule ThysisWeb.Schema.User do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [on_load: 2]

  alias ThysisWeb.User.Resolver
  alias Thysis.Projects

  @desc "User credential"
  object :credential do
    field(:id, non_null(:id))
    field(:source, :string)
    field(:token, :string)
    field(:user, :user)
    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
  end

  @desc "A User"
  object :user do
    field(:id, non_null(:id))
    field(:jwt, non_null(:string))
    field(:email, non_null(:string))
    field(:name, non_null(:string))
    field(:credential, :credential)

    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))

    field(:projects, list_of(:project),
      resolve: fn
        %{projects: %Ecto.Association.NotLoaded{}} = user, _args, %{context: %{loader: loader}} ->
          loader
          |> Dataloader.load(Projects, :projects, user)
          |> on_load(fn loader ->
            {:ok, Dataloader.get(loader, Projects, :projects, user)}
          end)

        %{projects: projects}, _, _ ->
          {:ok, projects}
      end
    )
  end

  @desc "Variables for creating User and credential"
  input_object :registration do
    field(:name, non_null(:string))
    field(:email, non_null(:string))
    field(:source, non_null(:string))
    field(:password, non_null(:string))
    field(:password_confirmation, non_null(:string))
  end

  @desc "Variables for updating User"
  input_object :update_user do
    field(:jwt, non_null(:string))
    field(:name, :string)
    field(:email, :string)
    field(:_rev, :string)
  end

  @desc "Variables for login in User"
  input_object :login_user do
    field(:password, :string)
    field(:email, :string)
  end

  @desc "Input variables for refreshing user"
  input_object :refresh_input do
    field(:jwt, non_null(:string))
  end

  @desc "Request password recovery token success response"
  object :anfordern_pzs do
    field(:email, :string |> non_null)
    field(:token, :string |> non_null)
  end

  @desc "PZS Token Kontrollieren Erfolgeich Nachricht"
  object :pzs_token_kontrollieren_nachricht do
    field(:token, :string |> non_null)
  end

  @desc "PZS input"
  input_object :pzs do
    field(:token, non_null(:string))
    field(:password, non_null(:string))
    field(:password_confirmation, non_null(:string))
  end

  @desc "Mutations allowed on User object"
  object :user_mutation do
    @desc "Create a user and her credential"
    field :registration, :user do
      arg(:registration, non_null(:registration))

      resolve(&Resolver.create/3)
    end

    @desc "Update a user"
    field :update, :user do
      arg(:user, non_null(:update_user))

      resolve(&Resolver.update/3)
    end

    @desc "Log in a user"
    field :login, :user do
      arg(:login, non_null(:login_user))

      resolve(&Resolver.login/3)
    end

    field :anfordern_pzs, :anfordern_pzs do
      arg(:email, :string |> non_null())
      resolve(&Resolver.anfordern_pzs/3)
    end

    @desc "Reset user password"
    field :veranderung_pzs, :user do
      arg(:input, non_null(:pzs))
      resolve(&Resolver.veranderung_pzs/3)
    end
  end

  @desc "Queries allowed on User object"
  object :user_query do
    @desc "Refresh a user session"
    field :refresh, :user do
      arg(:refresh, non_null(:refresh_input))
      resolve(&Resolver.refresh/3)
    end
  end
end
