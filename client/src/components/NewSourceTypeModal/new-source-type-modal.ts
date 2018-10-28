import React from "react";
import { ApolloError } from "apollo-client";
import { FetchResult } from "react-apollo";

import { CreateSourceType } from "../../graphql/gen.types";
import { UserLocalGqlData } from "../../state/auth-user.local.query";

export interface CreateSourceTypeProps {
  createSourceType: (
    name: string
  ) => Promise<void | FetchResult<CreateSourceType>>;
}

export type OwnProps = UserLocalGqlData & {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
};

export type Props = CreateSourceTypeProps & OwnProps;

export interface FormValues {
  name: string;
}

export const initialFormValues: FormValues = {
  name: ""
};

export interface State {
  initialFormValues: FormValues;
  graphQlError?: ApolloError;
  submitting: boolean;
  submitSuccess: boolean;
}

export const initialState: State = {
  initialFormValues,
  graphQlError: undefined,
  submitting: false,
  submitSuccess: false
};
