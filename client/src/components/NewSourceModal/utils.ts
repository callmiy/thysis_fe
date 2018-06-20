import { RouteComponentProps } from "react-router-dom";
import { FieldProps } from "formik";
import { ApolloError } from "apollo-client";

import { SourceFragFragment } from "../../graphql/gen.types";
import { CreateSourceInput } from "../../graphql/gen.types";
import { SourceTypeFragFragment } from "../../graphql/gen.types";

export interface FormValues {
  sourceType: SourceTypeFragFragment | null;
  author: string;
  topic: string;
  publication: string;
  url: string;
  year: string;
}

export const initialFormValues: FormValues = {
  sourceType: null,
  author: "",
  topic: "",
  publication: "",
  url: "",
  year: ""
};

export type FormValuesProps = FieldProps<FormValues>;

export interface NewSourceModalState {
  output: Partial<CreateSourceInput>;
  source?: SourceFragFragment;
  formError?: ApolloError;
}

export const initialState: NewSourceModalState = {
  output: {}
};

export interface NewSourceModalProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}
