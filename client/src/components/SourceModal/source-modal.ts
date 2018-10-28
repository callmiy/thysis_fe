import { RouteComponentProps } from "react-router-dom";
import { ApolloError } from "apollo-client";
import { FetchResult, WithApolloClient } from "react-apollo";

import { SourceFullFrag } from "../../graphql/gen.types";
import { SourceTypeFrag } from "../../graphql/gen.types";
import { AuthorFrag } from "../../graphql/gen.types";
import { CreateSource } from "../../graphql/gen.types";
import { CreateSourceFn } from "../../graphql/source.mutation";
import { CurrentProjectLocalData } from "../../state/project.local.query";

export interface FormValues {
  sourceType: SourceTypeFrag | null;
  authors: AuthorFrag[];
  topic: string;
  publication: string;
  url: string;
  year: string;
}

export const initialFormValues: FormValues = {
  sourceType: null,
  authors: [],
  topic: "",
  publication: "",
  url: "",
  year: ""
};

export interface State {
  source?: SourceFullFrag;
  formError?: ApolloError | { message: string };
}

export const initialState: State = {};

export interface OwnProps
  extends RouteComponentProps<{}>,
    CurrentProjectLocalData,
    WithApolloClient<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
  existingSource?: ExistingSourceProps;
  createSource: CreateSourceFn;
}

export interface CreateSourceProps {
  createSource: (
    values: FormValues
  ) => Promise<void | FetchResult<CreateSource>>;
}

export type Props = OwnProps & CreateSourceProps;

export interface ExistingSourceProps {
  onSourceChanged?: OnSourceChangedCb;
  source: SourceFullFrag;
}

export type OnSourceChangedCb = (source: SourceFullFrag) => void;
