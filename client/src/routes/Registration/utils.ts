import { GraphqlQueryControls } from "react-apollo";
import { ApolloError } from "apollo-client";
import { ChildProps } from "react-apollo";
import { WithApolloClient } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { UserRegMutation } from "../../graphql/gen.types";
import { UserRegMutationVariables } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{}> & UserRegMutation;

export type Props = GraphqlQueryControls<UserRegMutationVariables> &
  ChildProps<
    WithApolloClient<OwnProps>,
    UserRegMutation,
    UserRegMutationVariables
  >;

export interface FormValues {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  source?: string;
}

export enum FORM_VALUES_KEY {
  EMAIL = "email",
  NAME = "name",
  PASSWORD = "password",
  PASSWORD_CONFIRM = "passwordConfirmation",
  SOURCE = "source"
}

export const initialFormValues = {
  [FORM_VALUES_KEY.NAME]: "",
  [FORM_VALUES_KEY.EMAIL]: "",
  [FORM_VALUES_KEY.PASSWORD]: "",
  [FORM_VALUES_KEY.PASSWORD_CONFIRM]: "",
  [FORM_VALUES_KEY.SOURCE]: "password"
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
