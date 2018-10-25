defmodule ThisesWeb.Auth.AccessPipeline do
  use Guardian.Plug.Pipeline, otp_app: :thises

  plug(Guardian.Plug.VerifyHeader, realm: "Bearer")
  plug(Guardian.Plug.LoadResource, allow_blank: true)
end
