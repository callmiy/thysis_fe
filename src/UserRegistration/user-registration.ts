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
  gqlError?: ApolloError;
  otherErrors?: string;
  formErrors?: FormikErrors<Registration>;
}

export const initialState: State = {
  initialFormValues
};

export const formErrorTexts: {
  [k in keyof Registration]: { [t: string]: string }
} = {
  name: {
    min: "must be at least 2 characters",
    max: "is too long!"
  },

  email: {
    invalid: "is invalid"
  },

  password: {
    min: "must be at least 4 characters",
    max: "is too long!"
  },

  passwordConfirmation: {
    doesNotMatch: "Passwords don't match"
  },

  source: {}
};

export const ValidationSchema = Yup.object<Registration>().shape<Registration>({
  name: Yup.string()
    .min(2, formErrorTexts.name.min)
    .max(50, formErrorTexts.name.max)
    .required("is required"),
  email: Yup.string()
    .email(formErrorTexts.email.invalid)
    .required("is required"),
  password: Yup.string()
    .min(4, formErrorTexts.password.min)
    .max(50, formErrorTexts.password.max)
    .required("is required"),
  passwordConfirmation: Yup.string()
    .required("is required")
    .test(
      "passwords-match",
      formErrorTexts.passwordConfirmation.doesNotMatch,
      function(val) {
        return this.parent.password === val;
      }
    ),
  source: Yup.string().required("is required")
});

export const uiTexts = {
  submitBtnLabel: "Register User",
  fieldErrorTestId: "field error",
  formFieldErrorTestId: "form field error"
};

export function makeFieldErrorTestId(fieldName: string) {
  return fieldName + " " + uiTexts.fieldErrorTestId;
}

export function makeFormFieldErrorTestId(fieldName: string) {
  return fieldName + " " + uiTexts.formFieldErrorTestId;
}
