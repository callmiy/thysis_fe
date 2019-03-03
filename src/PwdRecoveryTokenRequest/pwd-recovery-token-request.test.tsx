import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent, act, waitForElement } from "react-testing-library";
import { ApolloError } from "apollo-client";

import { PwdRecoveryTokenRequest } from "./pwd-recovery-token-request-x";
import { Props } from "./pwd-recovery-token-request";
import { PwdRecoveryTokenRequestMutation } from "../graphql/apollo-types/PwdRecoveryTokenRequestMutation";
import { renderWithRouter, renderWithApollo } from "../test-utils";

const PwdRecoveryTokenRequestP = PwdRecoveryTokenRequest as React.FunctionComponent<
  Partial<Props>
>;

it("renders error message if requestPwdRecoveryToken not injected", async () => {
  /**
   * Given that a user is on the request password recovery token page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByTestId, getByText, getByLabelText, queryByText } = render(
    <Ui />
  );

  /**
   * She does not see any message telling her an error occurs
   */
  expect(queryByText(/Unable to make request/i)).not.toBeInTheDocument();

  /**
   * When she inputs her email address
   */
  fireEvent.change(getByLabelText(/Enter your email address/), {
    target: { value: "a@b.com" }
  });

  /**
   * And clicks on request password reset button
   */
  fireEvent.click(getByText(/Request password reset/));

  /**
   * Then she sees a message telling her an error occurred
   */

  const $error = await waitForElement(() =>
    getByText(/Unable to make request/i)
  );
  expect($error).toBeInTheDocument();

  /**
   * When she clicks the close button
   */
  fireEvent.click(getByTestId("closable-message-container").querySelector(
    ".close"
  ) as HTMLElement);

  /**
   * She sees that the message telling her an error occurred has disappeared
   */
  expect(queryByText(/Unable to make request/i)).not.toBeInTheDocument();
});

it("renders error if user has no network connection", async () => {
  const mockRequestPwdTokenRecovery = jest.fn(() =>
    Promise.reject(
      new ApolloError({
        errorMessage: "Network error"
      })
    )
  );

  /**
   * Given that a user is on the request password recovery token page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByText, getByLabelText, queryByText } = render(
    <Ui requestPwdTokenRecovery={mockRequestPwdTokenRecovery} />
  );

  /**
   * She does not see any message telling her she has no network connection
   */
  expect(queryByText(/You seem to be offline/i)).not.toBeInTheDocument();

  /**
   * When she inputs her email address
   */
  fireEvent.change(getByLabelText(/Enter your email address/), {
    target: { value: "a@b.com" }
  });

  /**
   * And clicks on request password reset button
   */
  act(() => {
    fireEvent.click(getByText(/Request password reset/));
  });

  /**
   * Then she sees a message telling her she is offline
   */
  const $message = await waitForElement(() =>
    getByText(/You seem to be offline/i)
  );

  expect($message).toBeInTheDocument();
});

test("submit disabled when email field is empty", () => {
  /**
   * Given that a user is on the request password recovery token page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByText, getByLabelText } = render(<Ui />);

  /**
   * Then she sees that the submit button is disabled
   */
  expect(getByText(/Request password reset/)).toBeDisabled();

  /**
   * When she enters at least 5 text (representing minimum email address text)
   */
  fireEvent.change(getByLabelText(/Enter your email address/), {
    target: { value: "a@b.c" }
  });

  /**
   * Then she sees that the submit button is no longer disabled
   */
  expect(getByText(/Request password reset/)).not.toBeDisabled();

  /**
   * When she enters text of less than length 5
   */
  fireEvent.change(getByLabelText(/Enter your email address/), {
    target: { value: "1".repeat(1 + Math.ceil(Math.random() * 3)) }
  });

  /**
   * Then she sees that the submit button is once again disabled
   */
  expect(getByText(/Request password reset/)).toBeDisabled();
});

it("sends password recovery token request and returns success", async () => {
  const email = "a@b.com";

  const data: PwdRecoveryTokenRequestMutation = {
    anfordernPzs: {
      __typename: "AnfordernPzs",
      email,
      token: ""
    }
  };

  const mockRequestPwdTokenRecovery = jest.fn(() =>
    Promise.resolve({
      data
    })
  );

  /**
   * Given that a user is on the request password recovery token page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByText, getByLabelText, queryByText, queryByLabelText } = render(
    <Ui requestPwdTokenRecovery={mockRequestPwdTokenRecovery} />
  );

  /**
   * She does not see any message showing her request was successful
   */
  expect(queryByText(/Success/i)).not.toBeInTheDocument();

  const $btn = getByText(/Request password reset/);

  /**
   * Nor did she see a loading indicator on the submit button
   */
  expect($btn.classList).not.toContain("loading");

  /**
   * When she inputs her email address
   */
  fireEvent.change(getByLabelText(/Enter your email address/i), {
    target: { value: email }
  });

  /**
   * And clicks on request password reset button
   */

  act(() => {
    fireEvent.click($btn);

    /**
     * The she sees that the submit button has a loading indicator
     */
    // expect($btn.classList).toContain("loading");
  });

  /**
   * Then she sees a message showing her request succeeded
   */
  const $message = await waitForElement(() => getByText(/Success/i));

  expect($message).toBeInTheDocument();

  /**
   * Und das die Formular ist verschwunden
   */
  expect(queryByLabelText(/Enter your email address/i)).not.toBeInTheDocument();
});

it("sends password recovery token request and does not return email or token", async () => {
  const email = "a@b.com";

  const mockRequestPwdTokenRecovery = jest.fn(() =>
    Promise.resolve({
      data: {} as PwdRecoveryTokenRequestMutation
    })
  );

  /**
   * Given that a user is on the request password recovery token page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByText, getByLabelText, queryByText } = render(
    <Ui requestPwdTokenRecovery={mockRequestPwdTokenRecovery} />
  );

  const anfordernErfolgreichNachrichtPattern = /Please check you inbox /i;

  /**
   * She does not see any message showing her request failed
   */
  expect(
    queryByText(anfordernErfolgreichNachrichtPattern)
  ).not.toBeInTheDocument();

  /**
   * When she inputs her email address
   */
  fireEvent.change(getByLabelText(/Enter your email address/), {
    target: { value: email }
  });

  /**
   * And clicks on request password reset button
   */
  act(() => {
    fireEvent.click(getByText(/Request password reset/));
  });

  /**
   * Then she sees a message showing her request did succeed
   */
  const $message = await waitForElement(() =>
    getByText(anfordernErfolgreichNachrichtPattern)
  );

  expect($message).toBeInTheDocument();
});

it("renders error if form is invalid", async () => {
  /**
   * Given that a user is on the password recovery token request page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByLabelText, getByText, queryByText } = render(
    <Ui requestPwdTokenRecovery={jest.fn()} />
  );

  /**
   * When she completes the form with invalid email address
   */
  fireEvent.change(getByLabelText(/Enter your email address/i), {
    target: { value: "aaaaa@b." }
  });

  /**
   * She does not see email error message on the page
   */
  expect(queryByText(/email invalid/i)).not.toBeInTheDocument();

  /**
   * When she submits the form
   */
  act(() => fireEvent.click(getByText(/Request password reset/i)));

  /**
   * Then she sees email error messages on the screen
   */
  const $error = await waitForElement(() => getByText(/email invalid/i));
  expect($error).toBeInTheDocument();
});

test("login instead", () => {
  /**
   * Given that a user is on the password recovery token request page
   */
  const { Ui: ui } = renderWithRouter(PwdRecoveryTokenRequestP);
  const { Ui } = renderWithApollo(ui);

  const { getByText } = render(<Ui requestPwdTokenRecovery={jest.fn()} />);

  /**
   * She should be able to click on the login instead button
   */
  fireEvent.click(getByText(/login instead/i));
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
