defmodule Thysis.SourceType do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Sources.Source
  alias Thysis.Accounts.User

  @timestamps_opts [
    type: Timex.Ecto.DateTime,
    autogenerate: {Timex.Ecto.DateTime, :autogenerate, []}
  ]

  schema "source_types" do
    field(:name, :string)
    has_many(:sources, Source)
    belongs_to(:user, User)
  end

  @doc "changeset"
  def changeset(source_type, attrs \\ %{}) do
    source_type
    |> cast(attrs, [:name, :user_id])
    |> validate_required([:name, :user_id])
    |> assoc_constraint(:user)
    |> unique_constraint(:name, name: :source_types_name_user_id)
  end
end
