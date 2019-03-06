import React from "react";
import { Button, Card, Input, Message, Icon, Form } from "semantic-ui-react";
import {
  Formik,
  FormikProps,
  Field,
  FieldProps,
  FormikActions,
  FormikErrors
} from "formik";
import isEmpty from "lodash/isEmpty";
import { NavLink } from "react-router-dom";
import update from "immutability-helper";

import "./login.scss";
import {
  initialState,
  Props,
  State,
  FORM_VALUES_KEY,
  FormValues,
  uiTexts
} from "./login";
import {
  setTitle,
  PROJECTS_URL,
  USER_REG_URL,
  PWD_RECOVERY_REQUEST_ROUTE
} from "../routes/util";
import RootHeader from "../components/Header";
import connectAndLoad from "../state/initial-data";
import { Container } from "./login-styles";

export class Login extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, currentState: State) {
    const { loggedOutUser } = nextProps;

    if (loggedOutUser) {
      return update(currentState, {
        initialFormValues: {
          email: {
            $set: loggedOutUser.email
          }
        }
      });
    }

    return null;
  }

  state = initialState;

  async componentDidMount() {
    setTitle("Sign In");

    const { updateLocalUser, loggedOutUser } = this.props;
    // If we have loggedOutUser, then it means we have signed out before and
    // thus will not sign out again
    if (!loggedOutUser) {
      // sign out the user
      const result = await updateLocalUser({
        variables: {
          user: null
        }
      });

      if (result) {
        const { data } = result;

        if (data) {
          const { user } = data;

          if (user) {
            this.setState(s =>
              update(s, {
                initialFormValues: {
                  email: {
                    $set: user.email
                  }
                }
              })
            );
          }
        }
      }
    }
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <Container className="login-route">
        <RootHeader title="Thysis" />

        <div className="main">
          <Formik
            initialValues={this.state.initialFormValues}
            enableReinitialize={true}
            onSubmit={this.submit}
            render={this.renderForm}
            validate={this.validate}
          />
        </div>
      </Container>
    );
  }

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      const error = this.formValuesEmpty(values)
        ? ""
        : this[`validate${key.charAt(0).toUpperCase()}${key.slice(1)}`](
            values[key]
          );

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  validateEmail = (email: string | null) => {
    if (
      !(
        email &&
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      )
    ) {
      return "Enter valid email";
    }

    this.setState(prev =>
      update(prev, {
        formValues: {
          email: {
            $set: email
          }
        }
      })
    );

    return "";
  };

  validatePassword = (password: string | null) => {
    if (!password) {
      return "Enter Password";
    }

    if (password.length < 4) {
      return "Too short";
    }

    this.setState(prev =>
      update(prev, {
        formValues: {
          password: {
            $set: password
          }
        }
      })
    );

    return "";
  };

  renderFormError = () => {
    const { gqlError } = this.state;

    if (gqlError) {
      const content = JSON.parse(gqlError.graphQLErrors[0].message).error;

      return (
        <Card.Content extra={true}>
          <Message error={true} onDismiss={this.handleErrorMsgDismiss}>
            <Message.Content>{content}</Message.Content>
          </Message>
        </Card.Content>
      );
    }

    return undefined;
  };

  private submit = async (
    values: FormValues,
    formikBag: FormikActions<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    const { benutzerEinLogin, client, updateLocalUser } = this.props;

    try {
      const result = await benutzerEinLogin({
        variables: {
          login: this.state.formValues
        }
      });

      if (result && result.data) {
        const user = result.data.login;

        if (user) {
          const { projects, jwt } = user;
          connectAndLoad(projects, client, jwt);

          await updateLocalUser({
            variables: { user }
          });

          this.props.history.replace(PROJECTS_URL);
        }
      }
    } catch (gqlError) {
      formikBag.setSubmitting(false);
      this.setState({ gqlError });
    }
  };

  private renderForm = ({
    dirty,
    isSubmitting,
    errors,
    handleSubmit
  }: FormikProps<FormValues>) => {
    const { gqlError } = this.state;
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors) || !!gqlError;

    return (
      <Card>
        <Card.Content className="form-title" extra={true}>
          Login to Thysis
        </Card.Content>

        {this.renderFormError()}

        <Card.Content>
          <Form onSubmit={handleSubmit}>
            {[
              ["Email", "email", FORM_VALUES_KEY.EMAIL],
              ["Password", "password", FORM_VALUES_KEY.PASSWORD]
            ].map(data => {
              const [label, type, name] = data;
              return (
                <Field
                  key={name}
                  name={name}
                  render={this.renderInput(label, type)}
                />
              );
            })}

            <label htmlFor="user-login-submit-btn" className="submit-btn-label">
              {uiTexts.submitBtnLabel}
            </label>

            <Button
              id="user-login-submit-btn"
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
          <NavLink className="to-reg-button" to={PWD_RECOVERY_REQUEST_ROUTE}>
            Forgot your password?
          </NavLink>
        </Card.Content>

        <Card.Content extra={true}>
          <NavLink className="to-reg-button" to={USER_REG_URL}>
            Don't have an account? Sign Up
          </NavLink>
        </Card.Content>
      </Card>
    );
  };

  private renderInput = (label: string, type: string) => (
    formProps: FieldProps<FormValues>
  ) => {
    const { field, form } = formProps;
    const {
      initialFormValues: { email }
    } = this.state;
    const name = field.name as FORM_VALUES_KEY;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    let autoFocus = false;

    if (name === FORM_VALUES_KEY.EMAIL && !email) {
      autoFocus = true;
    } else if (name === FORM_VALUES_KEY.PASSWORD && email) {
      autoFocus = true;
    }

    return (
      <div>
        <Form.Field
          {...field}
          type={type}
          control={Input}
          placeholder={label}
          autoComplete="off"
          label={label}
          id={name}
          error={booleanError}
          onBlur={this.handleFormControlBlur(name, form)}
          onFocus={this.handleFocus}
          autoFocus={autoFocus}
        />

        {booleanError && touched && (
          <Message
            style={{
              display: "block",
              padding: "0.5em",
              marginBottom: "1em",
              marginTop: "-10px"
            }}
            error={true}
            header={error}
          />
        )}
      </div>
    );
  };

  private handleFormControlBlur = (
    name: FORM_VALUES_KEY,
    form: FormikProps<FormValues>
  ) => () => {
    form.setFieldTouched(name, true);
  };

  private handleFocus = () => {
    this.setState({ gqlError: undefined });
  };

  private handleErrorMsgDismiss = () => this.setState({ gqlError: undefined });

  private formValuesEmpty = (values: FormValues) => {
    let result = true;

    for (const value of Object.values(values)) {
      if (value.trim()) {
        result = false;
      }
    }

    return result;
  };
}

export default Login;
