# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Thysis.Repo.insert!(%Thysis.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

defmodule Seed do
  alias Thysis.Repo
  alias Thysis.SourceType
  alias Thysis.Sources.Source
  alias Thysis.Quote
  alias Thysis.Tag
  alias Thysis.QuoteTag
  alias Thysis.SourceAuthor
  alias Thysis.Factory.Source, as: SourceFactory
  alias Thysis.Factory.Registration, as: RegFactory
  alias Thysis.Factory.Project, as: ProjectFactory
  alias Thysis.Factory.SourceType, as: SourceTypeFactory
  alias Thysis.Factory.Tag, as: TagFactory
  alias Thysis.Factory.Quote, as: QuoteFactory
  alias Thysis.Factory.QuoteTag, as: QuoteTagFactory
  alias Thysis.Accounts.User
  alias Thysis.Projects.Project
  alias Thysis.Author

  @source_type_names ["Journal", "Book", "Oral discussion", "Website"]

  def run do
    clear_tables()

    Repo.transaction(fn ->
      tags = TagFactory.insert_list(8)

      user =
        RegFactory.insert(
          email: "a@b.com", password: "123456", password_confirmation: "123456"
        )

      projects = projects(user)
      project_ids = Enum.map(projects, & &1.id)

      @source_type_names
      |> Enum.map(&SourceTypeFactory.insert(user: user, name: &1))
      |> Enum.flat_map(
        &SourceFactory.insert_list(
          Enum.random(2..3),
          source_type_id: &1.id,
          user_id: &1.user_id,
          project_id: Enum.random(project_ids)
        )
      )
      |> Enum.flat_map(
        &QuoteFactory.insert_list(Enum.random(2..5),
          source_id: &1.id
        )
      )
      |> Enum.each(fn q ->
        1..Enum.random(1..8)
        |> Enum.map(fn _ -> Enum.random(tags) end)
        |> Enum.uniq()
        |> Enum.each(&QuoteTagFactory.insert(quote_id: q.id, tag_id: &1.id))
      end)
    end)
  end

  defp projects(user),
    do:
      3..6
      |> Enum.random()
      |> ProjectFactory.insert_list(user: user)

  defp clear_tables,
    do:
      [
        QuoteTag,
        SourceAuthor,
        User,
        Project,
        SourceType,
        Source,
        Author,
        Quote,
        Tag
      ]
      |> Enum.each(&Repo.delete_all(&1))
end

Seed.run()
