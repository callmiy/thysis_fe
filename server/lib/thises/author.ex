defmodule Thysis.Author do
  use Ecto.Schema
  import Ecto.Changeset

  alias Thysis.Sources.Source
  alias Thysis.Projects.Project
  alias Thysis.Accounts.User

  schema "authors" do
    field(:first_name, :string)
    field(:last_name, :string)
    field(:middle_name, :string)
    belongs_to(:project, Project)
    belongs_to(:user, User)
    many_to_many(:sources, Source, join_through: "source_authors")

    timestamps()
  end

  @doc false
  def changeset(author, attrs \\ %{}) do
    author
    |> cast(attrs, [
      :first_name,
      :last_name,
      :middle_name,
      :project_id,
      :user_id
    ])
    |> validate_required([:last_name, :project_id, :user_id])
    |> foreign_key_constraint(:project, name: "authors_project_id_user_id_fk")
  end
end
