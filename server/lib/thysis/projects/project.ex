defmodule Thysis.Projects.Project do
  use Ecto.Schema
  use Timex.Ecto.Timestamps

  import Ecto.Changeset

  alias Thysis.Accounts.User

  schema "projects" do
    field(:title, :string)

    belongs_to(:user, User)

    timestamps()
  end

  @doc false
  def changeset(project, attrs) do
    project
    |> cast(attrs, [:title, :user_id])
    |> validate_required([:title, :user_id])
    |> assoc_constraint(:user)
  end
end
