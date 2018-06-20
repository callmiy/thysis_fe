/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface CreateAuthorInput {
  name: string,
};

export interface CreateQuoteInput {
  // The quote date
  date?: string | null,
  // Optional miscellaneous information with regards to the quote
  extras?: string | null,
  // Optional (journal, textbook, magazine etc.) issue number
  issue?: string | null,
  // Optional end of page where quote is located
  pageEnd?: number | null,
  // Optional start of page where quote is located
  pageStart?: number | null,
  // The source id
  sourceId: string,
  // The tags i.e subject matters of the quote
  tags: Array< string | null >,
  // The quote text
  text: string,
  // Optional (journal, textbook, magazine etc.) volume number
  volume?: string | null,
};

export interface GetQuotes {
  source?: string | null,
};

export interface GetSourceInput {
  // ID of source
  id: string,
};

export interface CreateSourceInput {
  authorIds?: Array< string | null > | null,
  // The original owners of the work - Either author creation inputs
  // or list of author IDs mandatory
  authorMaps?: Array< CreateAuthorInput | null > | null,
  // For which conference was this work published - optional
  publication?: string | null,
  // The source type i.e. book, journal etc. - mandatory
  sourceTypeId: string,
  // The topic of the work, as given by authour - manadatory
  topic: string,
  // The URI where author's original work can be accessed - optional
  url?: string | null,
  // The year the source was published
  year?: string | null,
};

export interface GetTagInput {
  id?: string | null,
  text?: string | null,
};

export interface CreateTagInput {
  text: string,
};

// When we do full text search, the result returned will contain name of
// the table from which the result was returned. This object contains an
// enum of the possible table names
export enum QuoteFullSearchTable {
  AUTHORS = "AUTHORS",
  QUOTES = "QUOTES",
  SOURCES = "SOURCES",
  SOURCE_TYPES = "SOURCE_TYPES",
  TAGS = "TAGS",
}


export interface QuoteFullSearchInput {
  text: string,
};

export interface GetAllAuthorsQuery {
  authors:  Array< {
    id: string,
    name: string,
  } | null > | null,
};

export interface CreateAuthorMutationVariables {
  author: CreateAuthorInput,
};

export interface CreateAuthorMutation {
  // Create an author
  createAuthor:  {
    id: string,
    name: string,
  } | null,
};

export interface CreateQuoteMutationVariables {
  quote: CreateQuoteInput,
};

export interface CreateQuoteMutation {
  // Create a quote
  createQuote:  {
    id: string,
    text: string,
    date: string | null,
    source:  {
      id: string,
      display: string | null,
      year: string | null,
      sourceType:  {
        id: string,
        name: string | null,
      },
    } | null,
  } | null,
};

export interface Quotes1QueryVariables {
  quote?: GetQuotes | null,
};

export interface Quotes1Query {
  // Query list of quotes - everything, or filter by source
  quotes:  Array< {
    id: string,
    text: string,
    date: string | null,
  } | null > | null,
};

export interface Source1QueryVariables {
  source: GetSourceInput,
};

export interface Source1Query {
  source:  {
    id: string,
    display: string | null,
    year: string | null,
    sourceType:  {
      id: string,
      name: string | null,
    },
  } | null,
};

export interface SourceTypesQuery {
  sourceTypes:  Array< {
    id: string,
    name: string | null,
  } | null > | null,
};

export interface CreateSourceMutationVariables {
  source: CreateSourceInput,
};

export interface CreateSourceMutation {
  createSource:  {
    id: string,
    display: string | null,
    year: string | null,
    sourceType:  {
      id: string,
      name: string | null,
    },
  } | null,
};

export interface Sources1Query {
  // Query for all sources
  sources:  Array< {
    id: string,
    display: string | null,
    year: string | null,
    sourceType:  {
      id: string,
      name: string | null,
    },
  } | null > | null,
};

export interface TagQuoteQueryVariables {
  tag: GetTagInput,
};

export interface TagQuoteQuery {
  // Get a single tag
  tag:  {
    id: string,
    text: string,
    quotes:  Array< {
      id: string,
      text: string,
      date: string | null,
      source:  {
        display: string | null,
      } | null,
    } | null > | null,
  } | null,
};

export interface CreateTagMutationVariables {
  tag: CreateTagInput,
};

export interface CreateTagMutation {
  // Create a tag
  createTag:  {
    id: string,
    text: string,
  } | null,
};

export interface TagsMinimalQuery {
  tags:  Array< {
    id: string,
    text: string,
  } | null > | null,
};

export interface AllMatchingTextsQueryVariables {
  text: QuoteFullSearchInput,
};

export interface AllMatchingTextsQuery {
  // Specify any text to get queries or tags, or sources or
  // source types matching the text
  quoteFullSearch:  {
    // A search result from quotes table
    quotes:  Array< {
      // The ID of the row from which the search was obtained
      tid: number,
      // The matched search text
      text: string,
      // The table name from which the sarch was obtained
      source: QuoteFullSearchTable,
      // The column name of the table from which the search was obtained
      column: string,
    } | null > | null,
    // A search result from sources table
    sources:  Array< {
      // The ID of the row from which the search was obtained
      tid: number,
      // The matched search text
      text: string,
      // The table name from which the sarch was obtained
      source: QuoteFullSearchTable,
      // The column name of the table from which the search was obtained
      column: string,
    } | null > | null,
    // A search result from tags table
    tags:  Array< {
      // The ID of the row from which the search was obtained
      tid: number,
      // The matched search text
      text: string,
      // The table name from which the sarch was obtained
      source: QuoteFullSearchTable,
      // The column name of the table from which the search was obtained
      column: string,
    } | null > | null,
    // A search result from authors table
    authors:  Array< {
      // The ID of the row from which the search was obtained
      tid: number,
      // The matched search text
      text: string,
      // The table name from which the sarch was obtained
      source: QuoteFullSearchTable,
      // The column name of the table from which the search was obtained
      column: string,
    } | null > | null,
    // A search result from source types table
    sourceTypes:  Array< {
      // The ID of the row from which the search was obtained
      tid: number,
      // The matched search text
      text: string,
      // The table name from which the sarch was obtained
      source: QuoteFullSearchTable,
      // The column name of the table from which the search was obtained
      column: string,
    } | null > | null,
  } | null,
};

export interface AuthorFragFragment {
  id: string,
  name: string,
};

export interface Quote1FragFragment {
  id: string,
  text: string,
  date: string | null,
};

export interface QuoteFromtagFragFragment {
  id: string,
  text: string,
  date: string | null,
  source:  {
    display: string | null,
  } | null,
};

export interface SourceFragFragment {
  id: string,
  display: string | null,
  year: string | null,
  sourceType:  {
    id: string,
    name: string | null,
  },
};

export interface SourceTypeFragFragment {
  id: string,
  name: string | null,
};

export interface TagFragFragment {
  id: string,
  text: string,
};

export interface TagQuotesFragFragment {
  id: string,
  text: string,
  quotes:  Array< {
    id: string,
    text: string,
    date: string | null,
    source:  {
      display: string | null,
    } | null,
  } | null > | null,
};

export interface TextSearchResultFragFragment {
  // A search result from quotes table
  quotes:  Array< {
    // The ID of the row from which the search was obtained
    tid: number,
    // The matched search text
    text: string,
    // The table name from which the sarch was obtained
    source: QuoteFullSearchTable,
    // The column name of the table from which the search was obtained
    column: string,
  } | null > | null,
  // A search result from sources table
  sources:  Array< {
    // The ID of the row from which the search was obtained
    tid: number,
    // The matched search text
    text: string,
    // The table name from which the sarch was obtained
    source: QuoteFullSearchTable,
    // The column name of the table from which the search was obtained
    column: string,
  } | null > | null,
  // A search result from tags table
  tags:  Array< {
    // The ID of the row from which the search was obtained
    tid: number,
    // The matched search text
    text: string,
    // The table name from which the sarch was obtained
    source: QuoteFullSearchTable,
    // The column name of the table from which the search was obtained
    column: string,
  } | null > | null,
  // A search result from authors table
  authors:  Array< {
    // The ID of the row from which the search was obtained
    tid: number,
    // The matched search text
    text: string,
    // The table name from which the sarch was obtained
    source: QuoteFullSearchTable,
    // The column name of the table from which the search was obtained
    column: string,
  } | null > | null,
  // A search result from source types table
  sourceTypes:  Array< {
    // The ID of the row from which the search was obtained
    tid: number,
    // The matched search text
    text: string,
    // The table name from which the sarch was obtained
    source: QuoteFullSearchTable,
    // The column name of the table from which the search was obtained
    column: string,
  } | null > | null,
};

export interface TextSearchRowFragFragment {
  // The ID of the row from which the search was obtained
  tid: number,
  // The matched search text
  text: string,
  // The table name from which the sarch was obtained
  source: QuoteFullSearchTable,
  // The column name of the table from which the search was obtained
  column: string,
};
