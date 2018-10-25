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
import Thises.Factory
import Faker, only: [random_between: 2]

alias Thises.Repo
alias Thises.SourceType
alias Thises.Source
alias Thises.Quote
alias Thises.Tag
alias Thises.QuoteTag
alias Thises.SourceAuthor
alias Thises.Factory.Source, as: SourceFactory

[
  SourceAuthor,
  QuoteTag,
  SourceType,
  Source,
  Quote,
  Tag
]
|> Enum.each(&Repo.delete_all(&1))

Repo.transaction(fn ->
  tags = insert_list(8, :tag)

  ["Journal", "Book", "Oral discussion", "Website"]
  |> Enum.map(&insert(:source_type, name: &1))
  |> Enum.flat_map(
    &SourceFactory.insert_list(
      random_between(2, 3),
      source_type: &1
    )
  )
  |> Enum.flat_map(&insert_list(random_between(2, 5), :quote, source: &1))
  |> Enum.each(fn q ->
    1..random_between(1, 8)
    |> Enum.map(fn _ -> Enum.random(tags) end)
    |> Enum.uniq()
    |> Enum.each(&insert(:quote_tag, quote: q, tag: &1))
  end)
end)
