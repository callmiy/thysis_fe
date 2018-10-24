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
alias GasWeb.Query.Quote, as: QuoteQuery
alias GasWeb.Query.Author, as: AuthorQuery
alias GasWeb.Query.Source, as: SourceQuery
alias GasWeb.Query.SourceType, as: SourceTypeQuery
alias GasWeb.Query.Tag, as: TagQuery
alias Gas.Factory.Author, as: AuthorFactory
alias Gas.Factory.User, as: UserFactory
alias Gas.Query.Registration, as: RegistrationQuery
alias Gas.Factory.Registration, as: RegistrationFactory
alias GasWeb.Query.User, as: UserQuery
alias GasWeb.Auth.Guardian, as: GuardianApp
alias Gas.Accounts
alias Gas.Accounts.CredentialApi
alias Gas.Accounts.Credential
alias Gas.Accounts.Registration
alias Gas.Accounts.UserApi
alias Gas.Accounts.User
alias Gas.Factory.Project, as: ProjectFactory
alias Gas.Projects, as: ProjectApi
alias Gas.Projects.Project
