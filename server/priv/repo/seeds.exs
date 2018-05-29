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
alias Gas.Repo
alias Gas.SourceType
alias Gas.Source
alias Gas.Quote
alias Gas.SourceTypeApi
alias Gas.SourceApi
alias Gas.QuoteApi
alias Gas.Tag
alias Gas.TagApi

for module <- [SourceType, Source, Quote, Tag] do
  Repo.delete_all(module)
end

Repo.transaction(fn ->
  1..20 |> Enum.each(fn _ -> insert(:tag) end)

  1..10
  |> Enum.map(fn _ -> insert(:source_type) end)
  |> Enum.flat_map(fn type ->
    1..Faker.random_between(5, 10)
    |> Enum.map(fn _ -> insert(:source, source_type: type) end)
  end)
  |> Enum.each(fn source ->
    1..Faker.random_between(5, 10)
    |> Enum.map(fn _ -> insert(:quote, source: source) end)
  end)
end)
