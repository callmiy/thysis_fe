require Integer
import Ecto.Query, warn: false
alias Thises.Repo
alias Thises.QuoteApi
alias Thises.Quote
alias Thises.Source
alias Thises.SourceApi
alias Thises.SourceTypeApi
alias Thises.SourceType
alias Thises.Factory
alias Thises.Tag
alias Thises.TagApi
alias Thises.QuoteTag
alias Thises.QuoteTagApi
alias ThisesWeb.Schema
alias Thises.Author
alias Thises.AuthorApi
alias Thises.Factory.Source, as: SourceFactory
alias Thises.Factory.SourceStrategy, as: SourceStrategy
alias ThisesWeb.Query.Quote, as: QuoteQuery
alias ThisesWeb.Query.Author, as: AuthorQuery
alias ThisesWeb.Query.Source, as: SourceQuery
alias ThisesWeb.Query.SourceType, as: SourceTypeQuery
alias ThisesWeb.Query.Tag, as: TagQuery
alias Thises.Factory.Author, as: AuthorFactory
alias Thises.Factory.User, as: UserFactory
alias Thises.Query.Registration, as: RegistrationQuery
alias Thises.Factory.Registration, as: RegistrationFactory
alias ThisesWeb.Query.User, as: UserQuery
alias ThisesWeb.Auth.Guardian, as: GuardianApp
alias Thises.Accounts
alias Thises.Accounts.CredentialApi
alias Thises.Accounts.Credential
alias Thises.Accounts.Registration
alias Thises.Accounts.UserApi
alias Thises.Accounts.User
alias Thises.Factory.Project, as: ProjectFactory
alias Thises.Projects, as: ProjectApi
alias Thises.Projects.Project
