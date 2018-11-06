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