import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import {
  render,
  fireEvent,
  act,
  wait,
  waitForElement
} from "react-testing-library";

import {
  Props,
  FORM_RENDER_PROPS,
  uiTexts,
  formErrorTexts,
  makeFieldErrorTestId,
  makeFormFieldErrorTestId
} from "./user-registration";
import { UserReg } from "./user-registration-x";
import {
  renderWithApollo,
  renderWithRouter,
  HistoryProps
} from "../test-utils";
import { Registration } from "../graphql/apollo-types/globalTypes";
import {
  UserRegMutation,
  UserRegMutation_registration
} from "../graphql/apollo-types/UserRegMutation";
import { UserRegistrationMutationArgs } from "../graphql/user-reg.mutation";
import { AppSocketType } from "../socket";
import { PROJECTS_URL } from "../routes/util";
import { UserLocalMutationArgs } from "../state/user.local.mutation";
import { ApolloError } from "apollo-client";
import { GraphQLError } from "graphql";

const UserRegistrationP = UserReg as React.ComponentClass<Partial<Props>>;

it("submits form successfully", async () => {
  const { userRegistrationData, mockRegUser, data } = makeValidRegData();

  const mockUpdateLocalUser = jest.fn(() => Promise.resolve({}));

  const mockSocket = { connect: jest.fn() };

  const mockHistoryReplace = jest.fn();

  const props = {
    regUser: mockRegUser,
    socket: (mockSocket as unknown) as AppSocketType,
    updateLocalUser: mockUpdateLocalUser
  };

  /**
   * Given that user is on registration page
   */
  const { getByLabelText } = render(
    makeUi(props, { replace: mockHistoryReplace }).ui
  );

  /**
   * Then she sees that submit button is disabled
   */
  const $btn = getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i"));
  expect($btn).toBeDisabled();

  /**
   * When she fills the form completely
   */
  Object.entries(userRegistrationData).forEach(([label, value]) => {
    fireEvent.change(getByLabelText(new RegExp(label, "i")), {
      target: { value }
    });
  });

  fireEvent.change(getByLabelText(new RegExp("Password Confirmation", "i")), {
    target: { value: userRegistrationData.password }
  });

  /**
   * She sees that the submit button is now enabled
   */
  expect($btn).not.toBeDisabled();

  /**
   * When she submits the form
   */
  act(() => {
    fireEvent.click($btn);
  });

  /**
   * Then she is redirected to the projects page
   */
  await wait(() => {
    expect(mockSocket.connect).toHaveBeenCalledWith(
      (data.registration as UserRegMutation_registration).jwt
    );
  });

  expect(mockRegUser).toBeCalledWith({
    variables: {
      registration: {
        ...userRegistrationData,
        passwordConfirmation: userRegistrationData.password,
        source: "password"
      }
    }
  } as UserRegistrationMutationArgs);

  const mockUpdateLocalUserArgs: UserLocalMutationArgs = {
    variables: {
      user: data.registration
    }
  };

  await wait(() => {
    expect(mockUpdateLocalUser).toHaveBeenCalledWith(mockUpdateLocalUserArgs);
  });

  expect(mockHistoryReplace).toHaveBeenCalledWith(PROJECTS_URL);
});

it("renders form field errors", async () => {
  /**
   * Given that a user is on the registration page
   */
  const { getByLabelText, getByTestId } = render(makeUi().ui);

  /**
   * When she completes the form
   */
  const userRegistrationData = {
    email: "a@b.111",
    name: "j",
    password: "123",
    passwordConfirmation: "1234"
  } as Registration;

  Object.entries(userRegistrationData).forEach(([k, value]) => {
    fireEvent.change(
      getByLabelText(new RegExp(FORM_RENDER_PROPS[k].label, "i")),
      {
        target: { value }
      }
    );
  });

  act(() => {
    fireEvent.click(getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")));
  });

  const $nameError = await waitForElement(() =>
    getByTestId(makeFieldErrorTestId("name"))
  );

  expect($nameError).toHaveTextContent(
    new RegExp(formErrorTexts.name.min, "i")
  );

  [
    ["email", "invalid"],
    ["password", "min"],
    ["passwordConfirmation", "doesNotMatch"]
  ].forEach(([fieldName, errorType]) => {
    expect(getByTestId(makeFieldErrorTestId(fieldName))).toHaveTextContent(
      new RegExp(formErrorTexts[fieldName][errorType], "i")
    );

    expect(getByTestId(makeFormFieldErrorTestId(fieldName))).toBeTruthy();
  });
});

it("renders form submission errors", async () => {
  const { userRegistrationData } = makeValidRegData();
  userRegistrationData.passwordConfirmation = userRegistrationData.password;

  const errorMessage = JSON.stringify({
    error: { email: "has already been taken" }
  });

  const gqlError = new GraphQLError(
    errorMessage,
    undefined,
    undefined,
    undefined,
    ["registration"]
  );

  const mockRegUser = jest.fn(() =>
    Promise.reject(
      new ApolloError({
        graphQLErrors: [gqlError]
      })
    )
  );
  /**
   * Given that a user is on the registration page
   */
  const { getByLabelText, getByText } = render(
    makeUi({
      regUser: mockRegUser
    }).ui
  );

  /**
   * When she completes the form
   */

  Object.entries(userRegistrationData).forEach(([k, value]) => {
    fireEvent.change(
      getByLabelText(new RegExp(FORM_RENDER_PROPS[k].label, "i")),
      {
        target: { value }
      }
    );
  });

  act(() => {
    fireEvent.click(getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")));
  });

  const $emailError = await waitForElement(() =>
    getByText(/has already been taken/i)
  );

  expect($emailError).toBeTruthy();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeUi(props: Partial<Props> = {}, historyProps: HistoryProps = {}) {
  const { Ui: ui, ...apolloRest } = renderWithApollo(UserRegistrationP);
  const { Ui, ...historyRest } = renderWithRouter(ui, historyProps);

  return { ui: <Ui {...props} />, ...apolloRest, ...historyRest };
}

function makeValidRegData(regData: Partial<Registration> = {}) {
  const userRegistrationData = {
    email: "a@b.com",
    name: "John De Way",
    password: "123456",
    ...regData
  } as Registration;

  const data = ({
    registration: {
      ...userRegistrationData,
      jwt: "jwt"
    }
  } as unknown) as UserRegMutation;

  const mockRegUser = jest.fn<
    Promise<{ data: UserRegMutation }>,
    [UserRegistrationMutationArgs | undefined]
  >(() => Promise.resolve({ data }));

  return { userRegistrationData, mockRegUser, data };
}
