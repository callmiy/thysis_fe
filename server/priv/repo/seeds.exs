# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Gas.Repo.insert!(%Gas.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
import Gas.Factory
import Faker, only: [random_between: 2]

alias Gas.Repo
alias Gas.SourceType
alias Gas.Source
alias Gas.Quote
alias Gas.Tag
alias Gas.QuoteTag

[
  QuoteTag,
  SourceType,
  Source,
  Quote,
  Tag
]
|> Enum.each(&Repo.delete_all(&1))

Repo.transaction(fn ->
  tags = insert_list(50, :tag)

  insert_list(10, :source_type)
  |> Enum.flat_map(&insert_list(random_between(5, 10), :source, source_type: &1))
  |> Enum.flat_map(&insert_list(random_between(5, 10), :quote, source: &1))
  |> Enum.each(fn q ->
    1..random_between(1, 20)
    |> Enum.map(fn _ -> Enum.random(tags) end)
    |> Enum.uniq()
    |> Enum.each(&insert(:quote_tag, quote: q, tag: &1))
  end)
end)
