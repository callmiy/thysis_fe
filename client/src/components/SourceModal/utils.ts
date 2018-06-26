import { RouteComponentProps } from "react-router-dom";
import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";

import { SourceFragFragment } from "../../graphql/gen.types";
import { CreateSourceInput } from "../../graphql/gen.types";
import { SourceTypeFragFragment } from "../../graphql/gen.types";
import { AuthorFragFragment } from "../../graphql/gen.types";
import { CreateSourceMutation } from "../../graphql/gen.types";
import { CreateSourceMutationVariables } from "../../graphql/gen.types";
import { CreateSourceMutationFn } from "../../graphql/ops.types";

export interface FormValues {
  sourceType: SourceTypeFragFragment | null;
  authors: AuthorFragFragment[];
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

export interface SourceModalState {
  output: CreateSourceInput;
  source?: SourceFragFragment;
  formError?: ApolloError;
  action?: Action;
}

export const initialState: SourceModalState = {
  output: {
    sourceTypeId: "",
    topic: ""
  }
};

export interface OwnProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
  action: Action;
  existingSource?: ExistingSourceProps;
  createSource: CreateSourceMutationFn;
}

export type SourceModalProps = ChildProps<
  OwnProps,
  CreateSourceMutation,
  CreateSourceMutationVariables
>;

export enum Action {
  VIEWING = "viewing",
  EDITING = "editing",
  NEW = "new"
}

export interface ExistingSourceProps {
  onSourceChanged?: OnSourceChangedCb;
  source: SourceFragFragment;
}

export type OnSourceChangedCb = (source: SourceFragFragment) => void;
