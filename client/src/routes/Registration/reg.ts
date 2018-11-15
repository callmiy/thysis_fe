import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { UserRegMutation } from "../../graphql/gen.types";
import { UserRegMutationVariables } from "../../graphql/gen.types";
import { UserRegMutationProps } from "../../graphql/ops.types";
import { UserLocalMutationProps } from "../../state/user.local.mutation";

export type OwnProps = RouteComponentProps<{}> &
  UserRegMutationProps &
  UserLocalMutationProps;

export type Props = ChildProps<
  OwnProps,
  UserRegMutation,
  UserRegMutationVariables
>;

export interface FormValues {
  email: string | undefined;
  name: string | undefined;
  password: string | undefined;
  passwordConfirmation: string | undefined;
  source: string;
}

export enum FORM_VALUES_KEY {
  EMAIL = "email",
  NAME = "name",
  PASSWORD = "password",
  PASSWORD_CONFIRM = "passwordConfirmation",
  SOURCE = "source"
}

const formValuesAcc = {} as FormValues;
const formValues = Object.values(FORM_VALUES_KEY).reduce(
  (acc, k) => ({ ...acc, [k]: undefined }),
  formValuesAcc
);

export const initialFormValues = {
  [FORM_VALUES_KEY.NAME]: "",
  [FORM_VALUES_KEY.EMAIL]: "",
  [FORM_VALUES_KEY.PASSWORD]: "",
  [FORM_VALUES_KEY.PASSWORD_CONFIRM]: "",
  [FORM_VALUES_KEY.SOURCE]: "password"
};

export interface State {
  initialFormValues: FormValues;
  graphQlError?: ApolloError;
  formValues: FormValues;
}

export const initialState: State = {
  initialFormValues,
  formValues
};
