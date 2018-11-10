require Integer
import Ecto.Query, warn: false
alias Thysis.Repo
alias Thysis.QuoteApi
alias Thysis.Quote
alias Thysis.Sources.Source
alias Thysis.Sources
alias Thysis.SourceTypeApi
alias Thysis.SourceType
alias Thysis.Tag
alias Thysis.TagApi
alias Thysis.QuoteTag
alias Thysis.QuoteTagApi
alias ThysisWeb.Schema
alias Thysis.Author
alias Thysis.AuthorApi
alias ThysisWeb.Auth.Guardian, as: GuardianApp
alias Thysis.Accounts
alias Thysis.Accounts.CredentialApi
alias Thysis.Accounts.Credential
alias Thysis.Accounts.Registration
alias Thysis.Accounts.UserApi
alias Thysis.Accounts.User
alias Thysis.Projects
alias Thysis.Projects.Project

########################### DEV ONLY ##########################

alias ThysisWeb.Query.Quote, as: QuoteQuery
alias ThysisWeb.Query.Author, as: AuthorQuery
alias ThysisWeb.Query.Source, as: SourceQuery
alias ThysisWeb.Query.SourceType, as: SourceTypeQuery
alias ThysisWeb.Query.Tag, as: TagQuery
alias Thysis.Query.Registration, as: RegistrationQuery
alias ThysisWeb.Query.User, as: UserQuery
alias Thysis.Factory
alias Thysis.Factory.Author, as: AuthorFactory
alias Thysis.Factory.User, as: UserFactory
alias Thysis.Factory.Source, as: SourceFactory
alias Thysis.Factory.Registration, as: RegFactory
alias Thysis.Factory.Project, as: ProjectFactory
alias Thysis.Factory.SourceType, as: SourceTypeFactory
alias Thysis.Factory.Tag, as: TagFactory
alias Thysis.Factory.Quote, as: QuoteFactory
alias Thysis.Factory.QuoteTag, as: QuoteTagFactory
