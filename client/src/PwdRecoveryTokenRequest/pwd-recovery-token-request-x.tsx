import React, { useState } from "react";
import { Form, Button, Icon, Input, Message } from "semantic-ui-react";
import styled from "styled-components/macro";
import { ApolloError } from "apollo-client";
import * as Yup from "yup";

import { Props } from "./pwd-recovery-token-request";

const Container = styled.div``;

const emailValidator = Yup.string()
  .required()
  .email("email invalid");

export function PwdRecoveryTokenRequest(props: Props) {
  const { requestPwdTokenRecovery } = props;

  const [otherErrors, setOtherErrors] = useState<string | undefined>(undefined);

  const [rawEmail, setEmail] = useState("");
  const [emailError, setEmailError] = useState<undefined | string>(undefined);

  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );

  async function onSubmit() {
    setEmailError(undefined);
    setOtherErrors(undefined);
    setSuccessMessage(undefined);

    if (!requestPwdTokenRecovery) {
      setOtherErrors("Unable to make request.");
      return;
    }

    const email = rawEmail.trim();

    try {
      await emailValidator.validate(email);
    } catch (error) {
      setEmailError(error.message);
    }

    try {
      const result = await requestPwdTokenRecovery({
        variables: {
          email
        }
      });

      const serverEmail =
        result &&
        result.data &&
        result.data.anfordernPzs &&
        result.data.anfordernPzs.email;

      if (serverEmail === email) {
        setSuccessMessage("Success");
      } else {
        setOtherErrors("Request unsuccessful.");
      }
    } catch (error) {
      const { message } = error as ApolloError;

      if (message.includes("Network error")) {
        setOtherErrors("You seem to be offline");
        return;
      }
    }
  }

  return (
    <Container>
      {otherErrors && (
        <div data-testid="closable-message-container">
          <Message
            onDismiss={() => setOtherErrors(undefined)}
            header="An Error occurred!"
            content={otherErrors}
          />
        </div>
      )}

      {successMessage && <Message header="Success!" content={successMessage} />}

      <Form onSubmit={onSubmit}>
        <Form.Field error={!!emailError}>
          <label htmlFor="email">Enter your email address</label>
          <Input
            type="email"
            id="email"
            name="email"
            onChange={(e, { value }) => {
              setEmail(value);
            }}
          />

          {emailError && <div>{emailError}</div>}
        </Form.Field>

        <div className="">
          <Button type="submit" color="green" disabled={rawEmail.length < 5}>
            <Icon name="checkmark" /> Request password reset
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default PwdRecoveryTokenRequest;
