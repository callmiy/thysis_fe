# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Thises.Repo.insert!(%Thises.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

defmodule Seed do
  alias Thises.Repo
  alias Thises.SourceType
  alias Thises.Sources.Source
  alias Thises.Quote
  alias Thises.Tag
  alias Thises.QuoteTag
  alias Thises.SourceAuthor
  alias Thises.Factory.Source, as: SourceFactory
  alias Thises.Factory.Registration, as: RegFactory
  alias Thises.Factory.Project, as: ProjectFactory
  alias Thises.Factory.SourceType, as: SourceTypeFactory
  alias Thises.Factory.Tag, as: TagFactory
  alias Thises.Factory.Quote, as: QuoteFactory
  alias Thises.Factory.QuoteTag, as: QuoteTagFactory
  alias Thises.Accounts.User
  alias Thises.Projects.Project
  alias Thises.Author

  @source_type_names ["Journal", "Book", "Oral discussion", "Website"]

  def run do
    clear_tables()

    Repo.transaction(fn ->
      tags = TagFactory.insert_list(8)
      user = RegFactory.insert()
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
