defmodule ThysisWeb.Auth.AccessPipeline do
  use Guardian.Plug.Pipeline, otp_app: :thysis

  plug(Guardian.Plug.VerifyHeader, realm: "Bearer")
  plug(Guardian.Plug.LoadResource, allow_blank: true)
end
