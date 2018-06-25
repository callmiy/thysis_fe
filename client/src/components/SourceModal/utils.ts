import { RouteComponentProps } from "react-router-dom";
import { FieldProps } from "formik";
import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";

import { SourceFragFragment } from "../../graphql/gen.types";
import { CreateSourceInput } from "../../graphql/gen.types";
import { SourceTypeFragFragment } from "../../graphql/gen.types";
import { AuthorFragFragment } from "../../graphql/gen.types";
import { CreateSourceMutation } from "../../graphql/gen.types";
import { CreateSourceMutationVariables } from "../../graphql/gen.types";
import { CreateSourceMutationCallResult } from "../../graphql/ops.types";

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

export type FormValuesProps = FieldProps<FormValues>;

export interface SourceModalState {
  output: CreateSourceInput | Partial<CreateSourceInput>;
  source?: SourceFragFragment;
  formError?: ApolloError;
  action?: Action;
}

export const initialState: SourceModalState = {
  output: {}
};

export type CreateSourceFn = (
  createSourceObject: Partial<CreateSourceInput>
) => CreateSourceMutationCallResult;

export interface OwnProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
  action: Action;
  existingSource?: ExistingSourceProps;
  createSource?: CreateSourceFn;
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
