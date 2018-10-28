import React from "react";
import { ApolloError } from "apollo-client";
import { FetchResult } from "react-apollo";

import { AuthorFrag, CreateAuthor } from "../../graphql/gen.types";
import { CurrentProjectLocalData } from "../../state/project.local.query";
import { UserLocalGqlData } from "../../state/auth-user.local.query";

export interface CreateAuthorMutationProps {
  createAuthor: (
    variables: FormValues
  ) => Promise<void | FetchResult<CreateAuthor>>;
}

type AuthorModalCreatedCb = (tag: AuthorFrag) => void;

export type OwnProps = CurrentProjectLocalData &
  UserLocalGqlData & {
    open: boolean;
    dismissModal: () => void;
    style: React.CSSProperties;
    onAuthorCreated?: AuthorModalCreatedCb;
  };

export type Props = CreateAuthorMutationProps & OwnProps;

export interface FormValues {
  lastName: string;
  firstName?: string | null;
  middleName?: string | null;
}

export enum FORM_OUTPUT_KEY {
  LAST_NAME = "lastName",
  FIRST_NAME = "firstName",
  MIDDLE_NAMES = "middleName"
}

export const initialFormOutput = {
  [FORM_OUTPUT_KEY.LAST_NAME]: "",
  [FORM_OUTPUT_KEY.FIRST_NAME]: "",
  [FORM_OUTPUT_KEY.MIDDLE_NAMES]: ""
};

export interface State {
  initialFormOutput: FormValues;
  formOutputs: FormValues;
  graphQlError?: ApolloError;
  submitting: boolean;
  submitSuccess: boolean;
}

export const initialState: State = {
  formOutputs: initialFormOutput,
  initialFormOutput,
  graphQlError: undefined,
  submitting: false,
  submitSuccess: false
};
