import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";
import * as Yup from "yup";
import { FormikErrors } from "formik";

import { UserRegistrationMutationProps } from "../graphql/user-reg.mutation";
import { UserLocalMutationProps } from "../state/user.local.mutation";
import { AppSocketType } from "../socket";
import { Registration } from "../graphql/apollo-types/globalTypes";

export interface OwnProps extends RouteComponentProps<{}> {
  socket?: AppSocketType;
}

export interface Props
  extends OwnProps,
    UserRegistrationMutationProps,
    UserLocalMutationProps {}

export const FORM_RENDER_PROPS: {
  [k in keyof Registration]: {
    label: string;
    type?: string;
  }
} = {
  name: { label: "Name" },
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
  passwordConfirmation: { label: "Password Confirmation", type: "password" },
  source: { label: "Source" }
};

export const initialFormValues: Registration = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  source: "password"
};

export interface State {
  initialFormValues: Registration;
  graphQlError?: ApolloError;
  otherErrors?: string;
  formErrors?: FormikErrors<Registration>;
}

export const initialState: State = {
  initialFormValues
};

export const ValidationSchema = Yup.object<Registration>().shape<Registration>({
  name: Yup.string()
    .min(2, "must be at least 2 characters")
    .max(50, "is too long!")
    .required("is required"),
  email: Yup.string()
    .email("is invalid")
    .required("is required"),
  password: Yup.string()
    .min(4, "must be at least 4 characters")
    .max(50, "is too Long!")
    .required("is required"),
  passwordConfirmation: Yup.string()
    .required("is required")
    .test("passwords-match", "Passwords don't match", function(val) {
      return this.parent.password === val;
    }),
  source: Yup.string().default(() => "password")
});
