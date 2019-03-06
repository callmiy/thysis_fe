import { ApolloError } from "apollo-client";
import { WithApolloClient } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { LoginMutationMerkmale } from "../graphql/login.mutation";
import { UserLocalMutationProps } from "../state/user.local.mutation";
import { LoggedOutUserProps } from "../state/logged-out-user.local.query";

export type OwnProps = WithApolloClient<{}> & RouteComponentProps<{}>;

export interface Props
  extends OwnProps,
    LoginMutationMerkmale,
    UserLocalMutationProps,
    LoggedOutUserProps {}

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
