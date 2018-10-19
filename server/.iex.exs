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
alias GasWeb.QuoteQueries
alias GasWeb.AuthorQueries
alias GasWeb.SourceQueries
alias GasWeb.SourceTypeQueries
alias GasWeb.TagQueries
alias Gas.Factory.Author, as: AuthorFactory
