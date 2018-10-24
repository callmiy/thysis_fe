defmodule GasWeb.Schema.User do
  use Absinthe.Schema.Notation

  import Absinthe.Resolution.Helpers, only: [dataloader: 1]

  alias GasWeb.Schema
  alias GasWeb.UserResolver, as: Resolver
  alias Gas.Projects

  @desc "A User"
  object :user do
    @desc "PouchDb revision field"
    field(:_rev, non_null(:string))

    field :user_id, non_null(:id) do
      resolve(fn user, _, _ ->
        {:ok, user.id}
      end)
    end

    field :_id, non_null(:string) do
      resolve(fn user, _, _ -> {:ok, Schema.get_datetime_id(user.id)} end)
    end

    field :schema_type, non_null(:string) do
      resolve(fn _, _, _ -> {:ok, "User"} end)
    end

    field(:jwt, non_null(:string))

    field(:email, non_null(:string))
    field(:name, non_null(:string))
    field(:credential, :credential)

    field(:inserted_at, non_null(:iso_datetime))
    field(:updated_at, non_null(:iso_datetime))
    field(:projects, list_of(:project), resolve: dataloader(Projects))
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

  @desc "Mutations allowed on User object"
  object :user_mutation do
    @doc "Create a user and her credential"
    field :registration, :user do
      arg(:registration, non_null(:registration))

      resolve(&Resolver.create/3)
    end

    @doc "Update a user"
    field :update, :user do
      arg(:user, non_null(:update_user))

      resolve(&Resolver.update/3)
    end

    @doc "Log in a user"
    field :login, :user do
      arg(:login, non_null(:login_user))

      resolve(&Resolver.login/3)
    end
  end
end
