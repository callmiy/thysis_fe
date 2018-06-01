/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface SourceTypesQuery {
  sourceTypes:  Array< {
    id: string,
    name: string | null,
  } | null > | null,
};

export interface TagsMinimalQuery {
  tags:  Array< {
    id: string,
    text: string | null,
  } | null > | null,
};

export interface SourceTypeFragmentFragment {
  id: string,
  name: string | null,
};

export interface TagFragmentFragment {
  id: string,
  text: string | null,
};
