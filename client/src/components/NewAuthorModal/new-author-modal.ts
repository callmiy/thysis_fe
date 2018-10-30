import React from "react";
import { ApolloError } from "apollo-client";
import { FetchResult } from "react-apollo";

import {
  AuthorFrag,
  CreateAuthor,
  AuthorUpdate
} from "../../graphql/gen.types";
import { CurrProjLocalGqlProps } from "../../state/project.local.query";
import { UserLocalGqlProps } from "../../state/auth-user.local.query";

export interface CreateAuthorMutationProps {
  createAuthor: (
    variables: FormValues
  ) => Promise<void | FetchResult<CreateAuthor>>;
}

type AuthorModalCreatedCb = (tag: AuthorFrag) => void;

export interface AuthorUpdateGqlProps {
  authorUpdate: (
    id: string,
    form: FormValues
  ) => Promise<void | FetchResult<AuthorUpdate>>;
}

export interface OwnProps {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
  onAuthorCreated?: AuthorModalCreatedCb;
  author?: AuthorFrag;
  modal?: boolean;
}

export type Props = CurrProjLocalGqlProps &
  UserLocalGqlProps &
  CreateAuthorMutationProps &
  AuthorUpdateGqlProps &
  OwnProps;

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

export interface State {
  initialFormOutput: FormValues;
  graphQlError?: ApolloError;
  submitting: boolean;
  author?: AuthorFrag;
  open?: boolean;
}

export const initialState: State = {
  initialFormOutput: {
    [FORM_OUTPUT_KEY.LAST_NAME]: "",
    [FORM_OUTPUT_KEY.FIRST_NAME]: "",
    [FORM_OUTPUT_KEY.MIDDLE_NAMES]: ""
  },
  graphQlError: undefined,
  submitting: false
};
