import { RouteComponentProps } from "react-router-dom";
import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";

import { SourceFullFrag } from "../../graphql/gen.types";
import { CreateSourceInput } from "../../graphql/gen.types";
import { SourceTypeFrag } from "../../graphql/gen.types";
import { AuthorFrag } from "../../graphql/gen.types";
import { CreateSource as CreateSourceMutation } from "../../graphql/gen.types";
import { CreateSourceVariables } from "../../graphql/gen.types";
import { CreateSourceMutationFn } from "../../graphql/ops.types";

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
  output: CreateSourceInput;
  source?: SourceFullFrag;
  formError?: ApolloError;
}

export const initialState: State = {
  output: {
    sourceTypeId: "",
    topic: ""
  }
};

export interface OwnProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
  existingSource?: ExistingSourceProps;
  createSource: CreateSourceMutationFn;
}

export type Props = ChildProps<
  OwnProps,
  CreateSourceMutation,
  CreateSourceVariables
>;

export interface ExistingSourceProps {
  onSourceChanged?: OnSourceChangedCb;
  source: SourceFullFrag;
}

export type OnSourceChangedCb = (source: SourceFullFrag) => void;
