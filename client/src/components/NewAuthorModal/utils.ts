import React from "react";
import { ApolloError } from "apollo-client";

import { AuthorFrag } from "../../graphql/gen.types";

type AuthorModalCreatedCb = (tag: AuthorFrag) => void;

export interface Props {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
  onAuthorCreated?: AuthorModalCreatedCb;
}

export interface FormOutputs {
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
  initialFormOutput: FormOutputs;
  formOutputs: FormOutputs;
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
