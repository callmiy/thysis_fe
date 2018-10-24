defmodule Gas.Schema.UserTest do
  use Gas.DataCase, async: true

  alias GasWeb.Schema
  alias Gas.Query.Registration, as: RegQuery
  alias Gas.Factory.Registration, as: RegFactory
  alias GasWeb.Query.User, as: Query
  alias Gas.Factory.User, as: Factory
  alias GasWeb.Auth.Guardian, as: GuardianApp

  describe "mutation" do
    # @tag :skip
    test "registers user succeeds" do
      %{
        "name" => name,
        "email" => email
      } =
        attrs =
        RegFactory.params()
        |> RegFactory.stringify()

      queryMap = RegQuery.register()

      query = """
        mutation RegisterUser(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "registration" => %{
                    "userId" => _,
                    "name" => ^name,
                    "email" => ^email,
                    "jwt" => _jwt,
                    "credential" => %{
                      "credentialId" => _
                    }
                  }
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "registration" => attrs
                 }
               )
    end

    # @tag :skip
    test "registers user fails for none unique email" do
      attrs = RegFactory.params()
      RegFactory.insert(attrs)
      queryMap = RegQuery.register()

      query = """
        mutation RegisterUser(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                errors: [
                  %{
                    message:
                      "{\"name\":\"user\",\"error\":{\"email\":\"has already been taken\"}}",
                    path: ["registration"]
                  }
                ]
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "registration" => Factory.stringify(attrs)
                 }
               )
    end

    # @tag :skip
    test "update user succeeds" do
      user = RegFactory.insert()
      {:ok, jwt, _claim} = GuardianApp.encode_and_sign(user)

      attrs =
        Factory.params(jwt: jwt)
        |> Factory.stringify()

      queryMap = Query.update()

      query = """
        mutation updateUser(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "update" => %{
                    "userId" => _,
                    "name" => name,
                    "email" => email,
                    "jwt" => _jwt
                  }
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "user" => attrs
                 }
               )

      refute user.name == name
      refute user.email == email
    end

    # @tag :skip
    test "login succeeds" do
      %{email: email, password: password} = params = RegFactory.params()
      %{email: user_email} = RegFactory.insert(params)

      queryMap = RegQuery.login()

      query = """
        mutation LoginUser(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      assert {:ok,
              %{
                data: %{
                  "login" => %{
                    "userId" => _,
                    "name" => name,
                    "email" => ^email,
                    "jwt" => _jwt
                  }
                }
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "login" => %{
                     "email" => user_email,
                     "password" => password
                   }
                 }
               )
    end

    # @tag :skip
    test "login fails" do
      %{email: email, password: password} = params = RegFactory.params()
      RegFactory.insert(params)

      queryMap = RegQuery.login()

      query = """
        mutation LoginUser(#{queryMap.parameters}) {
          #{queryMap.query}
        }

        #{queryMap.fragments}
      """

      password = password <> "q"

      assert {:ok,
              %{
                errors: [%{message: "{\"error\":\"Invalid email/password\"}"}]
              }} =
               Absinthe.run(query, Schema,
                 variables: %{
                   "login" => %{
                     "email" => email,
                     "password" => password
                   }
                 }
               )
    end
  end
end
