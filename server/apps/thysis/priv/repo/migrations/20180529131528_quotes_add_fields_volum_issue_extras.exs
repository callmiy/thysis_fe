defmodule Thysis.Repo.Migrations.QuotesAddFieldsVolumIssueExtras do
  use Ecto.Migration

  def change do
    alter table("quotes") do
      modify(:page_start, :integer, null: true)
      modify(:date, :date, null: true)
      modify(:text, :text, null: false)
      add(:volume, :string)
      add(:issue, :string)
      add(:extras, :string)
    end
  end
end
