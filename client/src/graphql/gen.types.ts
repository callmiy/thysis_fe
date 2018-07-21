/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllAuthors
// ====================================================

export interface GetAllAuthors_authors {
  id: string;
  name: string;
}

export interface GetAllAuthors {
  authors: (GetAllAuthors_authors | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAuthor
// ====================================================

export interface CreateAuthor_createAuthor {
  id: string;
  name: string;
}

export interface CreateAuthor {
  createAuthor: CreateAuthor_createAuthor | null; // Create an author
}

export interface CreateAuthorVariables {
  author: CreateAuthorInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateQuote
// ====================================================

export interface CreateQuote_createQuote_source_authors {
  id: string;
  name: string;
}

export interface CreateQuote_createQuote_source_sourceType {
  id: string;
  name: string | null;
}

export interface CreateQuote_createQuote_source {
  id: string;
  display: string | null;
  year: string | null;
  authors: (CreateQuote_createQuote_source_authors | null)[];
  sourceType: CreateQuote_createQuote_source_sourceType;
}

export interface CreateQuote_createQuote {
  id: string;
  text: string;
  date: any | null;
  source: CreateQuote_createQuote_source | null;
}

export interface CreateQuote {
  createQuote: CreateQuote_createQuote | null; // Create a quote
}

export interface CreateQuoteVariables {
  quote: CreateQuoteInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Quotes1
// ====================================================

export interface Quotes1_quotes {
  id: string;
  text: string;
  date: any | null;
}

export interface Quotes1 {
  quotes: (Quotes1_quotes | null)[] | null; // Query list of quotes - everything, or filter by source
}

export interface Quotes1Variables {
  quote?: GetQuotes | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SourceFull
// ====================================================

export interface SourceFull_source_authors {
  id: string;
  name: string;
}

export interface SourceFull_source_sourceType {
  id: string;
  name: string | null;
}

export interface SourceFull_source {
  id: string;
  display: string | null;
  year: string | null;
  authors: (SourceFull_source_authors | null)[];
  sourceType: SourceFull_source_sourceType;
  topic: string;
  publication: string | null;
  url: string | null;
  insertedAt: any;
}

export interface SourceFull {
  source: SourceFull_source | null;
}

export interface SourceFullVariables {
  source: GetSourceInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SourceTypes
// ====================================================

export interface SourceTypes_sourceTypes {
  id: string;
  name: string | null;
}

export interface SourceTypes {
  sourceTypes: (SourceTypes_sourceTypes | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateSource
// ====================================================

export interface CreateSource_createSource_authors {
  id: string;
  name: string;
}

export interface CreateSource_createSource_sourceType {
  id: string;
  name: string | null;
}

export interface CreateSource_createSource {
  id: string;
  display: string | null;
  year: string | null;
  authors: (CreateSource_createSource_authors | null)[];
  sourceType: CreateSource_createSource_sourceType;
}

export interface CreateSource {
  createSource: CreateSource_createSource | null; // create source mutation
}

export interface CreateSourceVariables {
  source: CreateSourceInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Source1
// ====================================================

export interface Source1_source_authors {
  id: string;
  name: string;
}

export interface Source1_source_sourceType {
  id: string;
  name: string | null;
}

export interface Source1_source {
  id: string;
  display: string | null;
  year: string | null;
  authors: (Source1_source_authors | null)[];
  sourceType: Source1_source_sourceType;
}

export interface Source1 {
  source: Source1_source | null;
}

export interface Source1Variables {
  source: GetSourceInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Sources1
// ====================================================

export interface Sources1_sources_authors {
  id: string;
  name: string;
}

export interface Sources1_sources_sourceType {
  id: string;
  name: string | null;
}

export interface Sources1_sources {
  id: string;
  display: string | null;
  year: string | null;
  authors: (Sources1_sources_authors | null)[];
  sourceType: Sources1_sources_sourceType;
}

export interface Sources1 {
  sources: (Sources1_sources | null)[] | null; // Query for all sources
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TagQuote
// ====================================================

export interface TagQuote_tag_quotes_source {
  display: string | null;
}

export interface TagQuote_tag_quotes {
  id: string;
  text: string;
  date: any | null;
  source: TagQuote_tag_quotes_source | null;
}

export interface TagQuote_tag {
  id: string;
  text: string;
  question: string | null;
  quotes: (TagQuote_tag_quotes | null)[] | null;
}

export interface TagQuote {
  tag: TagQuote_tag | null; // Get a single tag
}

export interface TagQuoteVariables {
  tag: GetTagInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTag
// ====================================================

export interface CreateTag_createTag {
  id: string;
  text: string;
  question: string | null;
}

export interface CreateTag {
  createTag: CreateTag_createTag | null; // Create a tag
}

export interface CreateTagVariables {
  tag: CreateTagInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TagsMinimal
// ====================================================

export interface TagsMinimal_tags {
  id: string;
  text: string;
  question: string | null;
}

export interface TagsMinimal {
  tags: (TagsMinimal_tags | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllMatchingTexts
// ====================================================

export interface AllMatchingTexts_quoteFullSearch_quotes {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface AllMatchingTexts_quoteFullSearch_sources {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface AllMatchingTexts_quoteFullSearch_tags {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface AllMatchingTexts_quoteFullSearch_authors {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface AllMatchingTexts_quoteFullSearch_sourceTypes {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface AllMatchingTexts_quoteFullSearch {
  quotes: (AllMatchingTexts_quoteFullSearch_quotes | null)[] | null; // A search result from quotes table
  sources: (AllMatchingTexts_quoteFullSearch_sources | null)[] | null; // A search result from sources table
  tags: (AllMatchingTexts_quoteFullSearch_tags | null)[] | null; // A search result from tags table
  authors: (AllMatchingTexts_quoteFullSearch_authors | null)[] | null; // A search result from authors table
  sourceTypes: (AllMatchingTexts_quoteFullSearch_sourceTypes | null)[] | null; // A search result from source types table
}

export interface AllMatchingTexts {
  quoteFullSearch: AllMatchingTexts_quoteFullSearch | null; // Specify any text to get queries or tags, or sources or     source types matching the text
}

export interface AllMatchingTextsVariables {
  text: QuoteFullSearchInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSource
// ====================================================

export interface UpdateSource_updateSource_authors {
  id: string;
  name: string;
}

export interface UpdateSource_updateSource_sourceType {
  id: string;
  name: string | null;
}

export interface UpdateSource_updateSource {
  id: string;
  display: string | null;
  year: string | null;
  authors: (UpdateSource_updateSource_authors | null)[];
  sourceType: UpdateSource_updateSource_sourceType;
  topic: string;
  publication: string | null;
  url: string | null;
  insertedAt: any;
}

export interface UpdateSource {
  updateSource: UpdateSource_updateSource | null; // update source mutation
}

export interface UpdateSourceVariables {
  source: UpdateSourceInput;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AuthorFrag
// ====================================================

export interface AuthorFrag {
  id: string;
  name: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Quote1Frag
// ====================================================

export interface Quote1Frag {
  id: string;
  text: string;
  date: any | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: QuoteFromtagFrag
// ====================================================

export interface QuoteFromtagFrag_source {
  display: string | null;
}

export interface QuoteFromtagFrag {
  id: string;
  text: string;
  date: any | null;
  source: QuoteFromtagFrag_source | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SourceFullFrag
// ====================================================

export interface SourceFullFrag_authors {
  id: string;
  name: string;
}

export interface SourceFullFrag_sourceType {
  id: string;
  name: string | null;
}

export interface SourceFullFrag {
  id: string;
  display: string | null;
  year: string | null;
  authors: (SourceFullFrag_authors | null)[];
  sourceType: SourceFullFrag_sourceType;
  topic: string;
  publication: string | null;
  url: string | null;
  insertedAt: any;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SourceTypeFrag
// ====================================================

export interface SourceTypeFrag {
  id: string;
  name: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SourceFrag
// ====================================================

export interface SourceFrag_authors {
  id: string;
  name: string;
}

export interface SourceFrag_sourceType {
  id: string;
  name: string | null;
}

export interface SourceFrag {
  id: string;
  display: string | null;
  year: string | null;
  authors: (SourceFrag_authors | null)[];
  sourceType: SourceFrag_sourceType;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TagFrag
// ====================================================

export interface TagFrag {
  id: string;
  text: string;
  question: string | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TagQuotesFrag
// ====================================================

export interface TagQuotesFrag_quotes_source {
  display: string | null;
}

export interface TagQuotesFrag_quotes {
  id: string;
  text: string;
  date: any | null;
  source: TagQuotesFrag_quotes_source | null;
}

export interface TagQuotesFrag {
  id: string;
  text: string;
  question: string | null;
  quotes: (TagQuotesFrag_quotes | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TextSearchResultFrag
// ====================================================

export interface TextSearchResultFrag_quotes {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface TextSearchResultFrag_sources {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface TextSearchResultFrag_tags {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface TextSearchResultFrag_authors {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface TextSearchResultFrag_sourceTypes {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

export interface TextSearchResultFrag {
  quotes: (TextSearchResultFrag_quotes | null)[] | null; // A search result from quotes table
  sources: (TextSearchResultFrag_sources | null)[] | null; // A search result from sources table
  tags: (TextSearchResultFrag_tags | null)[] | null; // A search result from tags table
  authors: (TextSearchResultFrag_authors | null)[] | null; // A search result from authors table
  sourceTypes: (TextSearchResultFrag_sourceTypes | null)[] | null; // A search result from source types table
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TextSearchRowFrag
// ====================================================

export interface TextSearchRowFrag {
  tid: number; // The ID of the row from which the search was obtained
  text: string; // The matched search text
  source: QuoteFullSearchTable; // The table name from which the sarch was obtained
  column: string; // The column name of the table from which the search was obtained
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

// When we do full text search, the result returned will contain name of   the table from which the result was returned. This object contains an   enum of the possible table names
export enum QuoteFullSearchTable {
  AUTHORS = "AUTHORS",
  QUOTES = "QUOTES",
  SOURCES = "SOURCES",
  SOURCE_TYPES = "SOURCE_TYPES",
  TAGS = "TAGS"
}

// Input for creating an author
export interface CreateAuthorInput {
  name: string;
}

// Inputs for creating a Quote object
export interface CreateQuoteInput {
  date?: any | null;
  extras?: string | null;
  issue?: string | null;
  pageEnd?: number | null;
  pageStart?: number | null;
  sourceId: string;
  tags: (string | null)[];
  text: string;
  volume?: string | null;
}

// Inputs for querying list of quotes
export interface GetQuotes {
  source?: string | null;
}

// Input for getting a source
export interface GetSourceInput {
  id: string;
}

// Inputs for creating a source with authors
export interface CreateSourceInput {
  authorAttrs?: (CreateAuthorInput | null)[] | null;
  authorIds?: (string | null)[] | null;
  publication?: string | null;
  sourceTypeId: string;
  topic: string;
  url?: string | null;
  year?: string | null;
}

// Get tag input
export interface GetTagInput {
  id?: string | null;
  text?: string | null;
}

// Input for creating a tag
export interface CreateTagInput {
  text: string;
}

// Input for full text search on quotes, their sources, tags and source
//   types
export interface QuoteFullSearchInput {
  text: string;
}

// Inputs for updating a source
export interface UpdateSourceInput {
  authorAttrs?: (CreateAuthorInput | null)[] | null;
  authorIds?: (string | null)[] | null;
  deletedAuthors?: (string | null)[] | null;
  id: string;
  publication?: string | null;
  sourceTypeId?: string | null;
  topic?: string | null;
  url?: string | null;
  year?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
