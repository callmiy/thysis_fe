/* tslint:disable */
//  This file was automatically generated and should not be edited.

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

export interface TagsMinimalQuery {
  tags:  Array< {
    id: string,
    text: string,
  } | null > | null,
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
