defmodule Thysis.Projects.Project do
  use Ecto.Schema
  use Timex.Ecto.Timestamps

  import Ecto.Changeset

  alias Thysis.Accounts.User
  alias Thysis.Author
  alias Thysis.Sources.Source

  schema "projects" do
    field(:title, :string)

    belongs_to(:user, User)
    has_many(:authors, Author)
    has_many(:sources, Source)

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
