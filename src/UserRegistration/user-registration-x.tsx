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
  ValidationSchema
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

  private renderErrorOrSuccess = () => {
    const { graphQlError } = this.state;

    if (graphQlError) {
      return (
        <Card.Content extra={true}>
          <Message error={true} onDismiss={this.handleFormErrorDismissed}>
            <Message.Content>{graphQlError.message}</Message.Content>
          </Message>
        </Card.Content>
      );
    }

    return undefined;
  };

  private onSubmit = ({
    values,
    setSubmitting,
    validateForm
  }: FormikProps<Registration>) => async () => {
    setSubmitting(true);
    this.setState({
      graphQlError: undefined,
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

    if (!regUser) {
      this.setState({ otherErrors: "Unable to make request" });
      setSubmitting(false);
      return;
    }

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
    } catch (error) {
      setSubmitting(false);
      this.setState({ graphQlError: error });
    }
  };

  private renderForm = (formikProps: FormikProps<Registration>) => {
    const { dirty, isSubmitting, errors } = formikProps;

    const { graphQlError } = this.state;
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit =
      dirtyOrSubmitting || !isEmpty(errors) || !!graphQlError;

    return (
      <Card>
        <Card.Content className="form-title" extra={true}>
          Sign up for Thysis
        </Card.Content>

        {this.renderErrorOrSuccess()}

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
              Register User
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
    const { field, form } = formProps;
    const name = field.name;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];
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

        {booleanError && touched && <Message error={true} header={error} />}
      </div>
    );
  };

  private handleFormErrorDismissed = () =>
    this.setState({ graphQlError: undefined });
}

export default UserReg;
