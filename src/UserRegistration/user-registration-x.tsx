import React from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { FormikProps, Formik, Field, FieldProps } from "formik";
import isEmpty from "lodash/isEmpty";

import "./user-registration.scss";
import {
  Props,
  FORM_RENDER_PROPS,
  State,
  initialState,
  ValidationSchema,
  uiTexts,
  makeFieldErrorTestId,
  makeFormFieldErrorTestId
} from "./user-registration";
import { setTitle, PROJECTS_URL, LOGIN_URL } from "../routes/util";
import RootHeader from "../components/Header";
import { Registration } from "../graphql/apollo-types/globalTypes";
import defaultSocket from "../socket";
import { Container } from "./user-registration-styles";

export class UserReg extends React.Component<Props, State> {
  state = initialState;

  componentDidMount() {
    setTitle("Sign Up");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <Container className="user-reg-route">
        <RootHeader title="Thysis" />

        <div className="main">
          <Formik
            initialValues={this.state.initialFormValues}
            enableReinitialize={true}
            onSubmit={() => null}
            render={this.renderForm}
            validationSchema={ValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
          />
        </div>
      </Container>
    );
  }

  private renderFormErrors = () => {
    const { gqlError, formErrors } = this.state;
    let content = null;

    if (formErrors) {
      content = (
        <>
          <span>Errors in fields:</span>

          {Object.entries(formErrors).map(([k, err]) => {
            const { label } = FORM_RENDER_PROPS[k];

            return (
              <div key={label} data-testid={makeFormFieldErrorTestId(k)}>
                <span className="error-label">{label}:</span>

                <span style={{ marginLeft: "10px" }} className="error-text">
                  {err}
                </span>
              </div>
            );
          })}
        </>
      );
    } else if (gqlError) {
      content = gqlError.graphQLErrors.reduce(
        (acc, { path = [], message }) => {
          if (path[0] === "registration") {
            Object.entries(JSON.parse(message).error).forEach(([k, v]) => {
              acc.push(
                <div key={k}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}: {v}
                </div>
              );
            });
          }

          return acc;
        },
        [] as JSX.Element[]
      );
    }

    if (content) {
      return (
        <Card.Content extra={true}>
          <Message
            data-testid="form-errors"
            error={true}
            onDismiss={this.handleFormErrorDismissed}
          >
            <Message.Content>{content}</Message.Content>
          </Message>
        </Card.Content>
      );
    }

    return null;
  };

  private onSubmit = ({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<Registration>) => async () => {
    setSubmitting(true);
    this.setState({
      gqlError: undefined,
      otherErrors: undefined,
      formErrors: undefined
    });

    const formErrors = await validateForm(values);

    if (!isEmpty(formErrors)) {
      this.setState({ formErrors });
      setSubmitting(false);
      return;
    }

    const {
      regUser,
      socket = defaultSocket,
      updateLocalUser,
      history
    } = this.props;

    try {
      const result = await regUser({
        variables: {
          registration: values
        }
      });

      const user = result && result.data && result.data.registration;

      if (user) {
        if (user) {
          socket.connect(user.jwt);
        }

        await updateLocalUser({
          variables: { user }
        });

        history.replace(PROJECTS_URL);
      }
    } catch (gqlError) {
      setSubmitting(false);
      this.setState({ gqlError });
    }
  };

  private renderForm = (formikProps: FormikProps<Registration>) => {
    const { dirty, isSubmitting, errors } = formikProps;

    const { gqlError } = this.state;
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors) || !!gqlError;

    return (
      <Card>
        <Card.Content className="form-title" extra={true}>
          Sign up for Thysis
        </Card.Content>

        {this.renderFormErrors()}

        <Card.Content>
          <Form onSubmit={this.onSubmit(formikProps)}>
            {Object.entries(FORM_RENDER_PROPS).map(
              ([name, { label, type = "text" }]) => {
                return (
                  <Field
                    key={name}
                    name={name}
                    render={this.renderInput(label, type)}
                  />
                );
              }
            )}

            <label htmlFor="user-reg-submit-btn" className="submit-btn-label">
              {uiTexts.submitBtnLabel}
            </label>

            <Button
              id="user-reg-submit-btn"
              color="green"
              inverted={true}
              disabled={disableSubmit}
              loading={isSubmitting}
              type="submit"
              fluid={true}
            >
              <Icon name="checkmark" /> Ok
            </Button>
          </Form>
        </Card.Content>

        <Card.Content extra={true}>
          <NavLink className="to-login-button" to={LOGIN_URL}>
            Already have an account? Login
          </NavLink>
        </Card.Content>
      </Card>
    );
  };

  private renderInput = (label: string, type: string) => (
    formProps: FieldProps<Registration>
  ) => {
    const { field } = formProps;
    const { formErrors = {} } = this.state;
    const name = field.name;
    const error = formErrors[name];
    const booleanError = !!error;
    const isSourceField = name === "source";

    return (
      <div>
        <Form.Field
          {...field}
          className={`form-field ${isSourceField ? "disabled" : ""}`}
          type={type}
          control={Input}
          autoComplete="off"
          label={label}
          id={name}
          error={booleanError}
          autoFocus={name === "name"}
          readOnly={isSourceField}
        />

        {booleanError && (
          <Message
            data-testid={makeFieldErrorTestId(name)}
            error={true}
            header={error}
          />
        )}
      </div>
    );
  };

  private handleFormErrorDismissed = () => {
    this.setState({ gqlError: undefined, formErrors: undefined });
  };
}

export default UserReg;
