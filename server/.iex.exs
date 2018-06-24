require Integer
import Ecto.Query, warn: false
alias Gas.Repo
alias Gas.QuoteApi
alias Gas.Quote
alias Gas.Source
alias Gas.SourceApi
alias Gas.SourceTypeApi
alias Gas.SourceType
alias Gas.Factory
alias Gas.Tag
alias Gas.TagApi
alias Gas.QuoteTag
alias Gas.QuoteTagApi
alias GasWeb.Schema
alias Gas.Author
alias Gas.AuthorApi
alias Gas.Factory.Source, as: SourceFactory
alias Gas.Factory.SourceStrategy, as: SourceStrategy

[
  QuoteApi,
  Quote,
  SourceApi,
  SourceTypeApi,
  SourceType,
  Factory,
  Tag,
  TagApi,
  QuoteTag,
  QuoteTagApi,
  Author,
  SourceFactory,
  SourceStrategy
]
|> Enum.each(fn m -> :int.ni(m) end)
