import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, act, wait } from "react-testing-library";

import { Props } from "./user-registration";
import { UserReg } from "./user-registration-x";
import { renderWithApollo, renderWithRouter } from "../test-utils";
import { Registration } from "../graphql/apollo-types/globalTypes";
import {
  UserRegMutation,
  UserRegMutation_registration
} from "../graphql/apollo-types/UserRegMutation";
import { UserRegistrationMutationArgs } from "../graphql/user-reg.mutation";
import { AppSocketType } from "../socket";
import { PROJECTS_URL } from "../routes/util";
import { UserLocalMutationArgs } from "../state/user.local.mutation";

const UserRegistrationP = UserReg as React.ComponentClass<Partial<Props>>;

it("submits form successfully", async () => {
  const userRegistrationData = {
    email: "a@b.com",
    name: "John De Way",
    password: "123456"
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

  const mockUpdateLocalUser = jest.fn(() => Promise.resolve({}));

  const mockSocket = { connect: jest.fn() };

  const mockHistoryReplace = jest.fn();

  const { Ui: ui } = renderWithApollo(UserRegistrationP);
  const { Ui } = renderWithRouter(ui, { replace: mockHistoryReplace });

  /**
   * Given that user is on registration page
   */
  const { getByLabelText } = render(
    <Ui
      regUser={mockRegUser}
      socket={(mockSocket as unknown) as AppSocketType}
      updateLocalUser={mockUpdateLocalUser}
    />
  );

  /**
   * Then she sees that submit button is disabled
   */
  const $btn = getByLabelText(/Register User/i);
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
