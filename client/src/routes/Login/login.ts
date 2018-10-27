import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { LoginMutation } from "../../graphql/gen.types";
import { LoginMutationVariables } from "../../graphql/gen.types";
import { LoginMutationProps } from "../../graphql/ops.types";
import { UserLocalMutationProps } from "../../state/user.local.mutation";

export type OwnProps = RouteComponentProps<{}> & LoginMutation;

export type Props = ChildProps<
  OwnProps & LoginMutationProps & UserLocalMutationProps,
  LoginMutation,
  LoginMutationVariables
>;

export interface FormValues {
  email: string;
  password: string;
}

export enum FORM_VALUES_KEY {
  EMAIL = "email",
  PASSWORD = "password"
}

export const initialFormValues = {
  [FORM_VALUES_KEY.EMAIL]: "",
  [FORM_VALUES_KEY.PASSWORD]: ""
};

export interface State {
  initialFormValues: FormValues;
  formValues: FormValues;
  graphQlError?: ApolloError;
}

export const initialState: State = {
  formValues: initialFormValues,
  initialFormValues
};
