import React, { useState, useEffect } from "react";
import { Form, Button, Icon, Input, Message, Card } from "semantic-ui-react";
import styled from "styled-components/macro";
import { ApolloError } from "apollo-client";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";

import { Props } from "./pwd-recovery-token-request";
import {
  RouteContainer,
  RouteMain,
  visuallyHidden,
  redirectToAuthButtonCss
} from "../styles";
import RootHeader from "../components/Header";
import { LOGIN_URL, setTitle } from "./../routes/util";

const Container = styled(RouteMain)`
  display: flex;
  align-items: center;
  justify-content: center;

  label {
    ${visuallyHidden}
  }

  .card {
    min-width: 314px;
  }

  .to-login-route {
    ${redirectToAuthButtonCss}
  }
`;

function SUCCESS_MESSAGE(email: string) {
  return `Please check you inbox "${email}" and follow the given instruction.`;
}

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

  const [submitting, setSubmitting] = useState(false);

  useEffect(function setDocTitle() {
    setTitle("Request Password Recovery");

    return setTitle;
  }, []);

  async function submit() {
    setSubmitting(true);
    setEmailError(undefined);
    setOtherErrors(undefined);
    setSuccessMessage(undefined);

    const email = rawEmail.trim();

    try {
      await emailValidator.validate(email);
    } catch (error) {
      setEmailError(error.message);
      setSubmitting(false)
      return;
    }

    if (!requestPwdTokenRecovery) {
      setOtherErrors("Unable to make request.");
      setSubmitting(false)
      return;
    }

    try {
      await requestPwdTokenRecovery({
        variables: {
          email
        }
      });

      setSuccessMessage(SUCCESS_MESSAGE(email));
    } catch (error) {
      const { message } = error as ApolloError;

      if (message.includes("Network error")) {
        setOtherErrors("You seem to be offline");
        setSubmitting(false)
      } else {
        setSuccessMessage(SUCCESS_MESSAGE(email));
      }
    }
  }

  return (
    <RouteContainer>
      <RootHeader title="Thysis" />

      <Container>
        <Card>
          {successMessage ? (
            <>
              <Card.Content>
                <Message
                  success={true}
                  header="Success!"
                  content={successMessage}
                />
              </Card.Content>

              <LoginLink text="Login to your account" />
            </>
          ) : (
            <>
              <Card.Content className="form-title" extra={true}>
                Enter your email address to receive a link that you can use to
                reset your password
              </Card.Content>

              {otherErrors && (
                <Card.Content className="form-title" extra={true}>
                  {otherErrors && (
                    <div data-testid="closable-message-container">
                      <Message
                        onDismiss={() => setOtherErrors(undefined)}
                        header="An Error occurred!"
                        content={otherErrors}
                        error={true}
                      />
                    </div>
                  )}
                </Card.Content>
              )}

              <Card.Content>
                <Form onSubmit={submit}>
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

                  <Button
                    type="submit"
                    color="green"
                    disabled={rawEmail.length < 5}
                    style={{ display: "block", width: "100%" }}
                    loading={submitting}
                  >
                    <Icon name="checkmark" /> Request password reset
                  </Button>
                </Form>
              </Card.Content>

              <LoginLink text="Login instead" />
            </>
          )}
        </Card>
      </Container>
    </RouteContainer>
  );
}

export default PwdRecoveryTokenRequest;

function LoginLink({ text }: { text: string }) {
  return (
    <Card.Content extra={true}>
      <NavLink className="to-login-route" to={LOGIN_URL}>
        {text}
      </NavLink>
    </Card.Content>
  );
}
