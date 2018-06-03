/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface CreateQuoteInput {
  // The quote date
  date: string,
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

export interface CreateTagInput {
  text: string,
};

export interface CreateQuoteMutationVariables {
  quote: CreateQuoteInput,
};

export interface CreateQuoteMutation {
  // Create a quote
  createQuote:  {
    id: string,
    text: string,
    date: string,
    source:  {
      id: string,
      display: string | null,
      sourceType:  {
        id: string,
        name: string | null,
      },
    } | null,
  } | null,
};

export interface SourceMiniQuery {
  sources:  Array< {
    id: string,
    display: string | null,
    sourceType:  {
      id: string,
      name: string | null,
    },
  } | null > | null,
};

export interface SourceTypesQuery {
  sourceTypes:  Array< {
    id: string,
    name: string | null,
  } | null > | null,
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

export interface QuoteFragFragment {
  id: string,
  text: string,
  date: string,
};

export interface SourceMiniFragFragment {
  id: string,
  display: string | null,
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
