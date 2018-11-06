require Integer
import Ecto.Query, warn: false
alias Thises.Repo
alias Thises.QuoteApi
alias Thises.Quote
alias Thises.Sources.Source
alias Thises.Sources
alias Thises.SourceTypeApi
alias Thises.SourceType
alias Thises.Tag
alias Thises.TagApi
alias Thises.QuoteTag
alias Thises.QuoteTagApi
alias ThisesWeb.Schema
alias Thises.Author
alias Thises.AuthorApi
alias ThisesWeb.Auth.Guardian, as: GuardianApp
alias Thises.Accounts
alias Thises.Accounts.CredentialApi
alias Thises.Accounts.Credential
alias Thises.Accounts.Registration
alias Thises.Accounts.UserApi
alias Thises.Accounts.User
alias Thises.Projects
alias Thises.Projects.Project

########################### DEV ONLY ##########################

alias ThisesWeb.Query.Quote, as: QuoteQuery
alias ThisesWeb.Query.Author, as: AuthorQuery
alias ThisesWeb.Query.Source, as: SourceQuery
alias ThisesWeb.Query.SourceType, as: SourceTypeQuery
alias ThisesWeb.Query.Tag, as: TagQuery
alias Thises.Query.Registration, as: RegistrationQuery
alias ThisesWeb.Query.User, as: UserQuery
alias Thises.Factory
alias Thises.Factory.Author, as: AuthorFactory
alias Thises.Factory.User, as: UserFactory
alias Thises.Factory.Source, as: SourceFactory
alias Thises.Factory.Registration, as: RegFactory
alias Thises.Factory.Project, as: ProjectFactory
alias Thises.Factory.SourceType, as: SourceTypeFactory
alias Thises.Factory.Tag, as: TagFactory
alias Thises.Factory.Quote, as: QuoteFactory
alias Thises.Factory.QuoteTag, as: QuoteTagFactory
