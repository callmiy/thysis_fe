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
