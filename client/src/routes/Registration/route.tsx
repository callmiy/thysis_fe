import React from "react";
import { Button, Card } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";
import { FormikProps } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { FormikErrors } from "formik";
import isEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import "./reg.css";
import { Props, FORM_VALUES_KEY, State, initialState, FormValues } from "./reg";
import { setTitle, PROJECTS_URL, LOGIN_URL } from "../../routes/util";
import RootHeader from "../../components/Header";
import { Registration } from "src/graphql/gen.types";
import socket from "src/socket";

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
      <div className="user-reg-route">
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
      </div>
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

  private submit = async (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    let regValues = {} as Registration;
    regValues = Object.entries(this.state.formValues).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v }),
      regValues
    );

    try {
      const result = await this.props.regUser({
        variables: {
          registration: regValues
        }
      });

      if (result && result.data) {
        const user = result.data.registration;

        if (user) {
          socket.connect(user.jwt);
        }

        await this.props.updateLocalUser({
          variables: { user }
        });

        this.props.history.replace(PROJECTS_URL);
      }
    } catch (error) {
      formikBag.setSubmitting(false);
      this.setState({ graphQlError: error });
    }
  };

  private renderForm = ({
    dirty,
    isSubmitting,
    errors,
    handleSubmit
  }: FormikProps<FormValues>) => {
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
          <Form onSubmit={handleSubmit}>
            {[
              ["Name", "text", FORM_VALUES_KEY.NAME],
              ["Email", "email", FORM_VALUES_KEY.EMAIL],
              ["Password", "password", FORM_VALUES_KEY.PASSWORD],
              [
                "Password Confirm",
                "password",
                FORM_VALUES_KEY.PASSWORD_CONFIRM
              ],
              ["Source", "text", FORM_VALUES_KEY.SOURCE]
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
          </Form>
        </Card.Content>

        <Card.Content extra={true}>
          <Button
            id="author-modal-submit"
            color="green"
            inverted={true}
            disabled={disableSubmit}
            loading={isSubmitting}
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => handleSubmit()}
            type="button"
            fluid={true}
          >
            <Icon name="checkmark" /> Ok
          </Button>

          <NavLink className="to-login-button" to={LOGIN_URL}>
            Already have an account? Login
          </NavLink>
        </Card.Content>
      </Card>
    );
  };

  private renderInput = (label: string, type: string) => (
    formProps: FieldProps<FormValues>
  ) => {
    const { field, form } = formProps;
    const name = field.name as FORM_VALUES_KEY;
    const error = form.errors[name];
    const formIsEmpty = this.isFormEmpty();
    const booleanError = !!error && !formIsEmpty;
    const touched = form.touched[name];
    const isSourceField = name === FORM_VALUES_KEY.SOURCE;

    return (
      <div>
        <Form.Field
          {...field}
          className={`form-field ${isSourceField ? "disabled" : ""}`}
          type={type}
          control={Input}
          placeholder={label}
          autoComplete="off"
          label={label}
          id={name}
          error={booleanError}
          onBlur={this.handleFormControlBlur(name, form)}
          onFocus={this.handleFocus}
          autoFocus={name === FORM_VALUES_KEY.NAME}
          readOnly={isSourceField}
        />

        {booleanError && touched && !formIsEmpty && (
          <Message error={true} header={error} />
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
    this.setState({ graphQlError: undefined });
  };

  private handleFormErrorDismissed = () =>
    this.setState({ graphQlError: undefined });

  private validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const [key, val] of Object.entries(values)) {
      let error;

      switch (key) {
        case FORM_VALUES_KEY.NAME:
          error = this.validateName(val);
          break;

        case FORM_VALUES_KEY.EMAIL:
          error = this.validateEmail(val);
          break;

        case FORM_VALUES_KEY.PASSWORD:
          error = this.validatePassword(val);
          break;

        case FORM_VALUES_KEY.PASSWORD_CONFIRM:
          error = this.validatePasswordConfirm(
            val,
            values[FORM_VALUES_KEY.PASSWORD] || ""
          );
          break;

        case FORM_VALUES_KEY.SOURCE:
          error = this.validateSource(val);
      }

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  private validateName = (name: string | undefined) => {
    name = (name || "").trim();

    this.setState(s =>
      update(s, {
        formValues: {
          [FORM_VALUES_KEY.NAME]: {
            $set: name || undefined
          }
        }
      })
    );

    if (!name) {
      return "Enter name";
    }

    if (name.length < 2) {
      return "Too short";
    }

    return "";
  };

  private validateEmail = (email: string | undefined) => {
    email = (email || "").trim();
    let error = "";

    if (
      !(
        email &&
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      )
    ) {
      error = "Enter valid email";
    }

    this.setState(s =>
      update(s, {
        formValues: {
          [FORM_VALUES_KEY.EMAIL]: {
            $set: (error && undefined) || email
          }
        }
      })
    );

    return error;
  };

  private validatePassword = (password: string | undefined) => {
    password = (password || "").trim();
    let error = "";

    if (!password) {
      error = "Enter Password";
    } else if (password.length < 4) {
      error = "Too short";
    }

    this.setState(s =>
      update(s, {
        formValues: {
          [FORM_VALUES_KEY.PASSWORD]: {
            $set: (error && undefined) || password
          }
        }
      })
    );

    return error;
  };

  private validatePasswordConfirm = (
    confirm: string | undefined,
    pwd: string
  ) => {
    confirm = (confirm || "").trim();
    let error = "";

    if (!confirm) {
      error = "Confirm Password";
    } else if (confirm !== pwd) {
      error = "Passwords don't match";
    }

    this.setState(s =>
      update(s, {
        formValues: {
          [FORM_VALUES_KEY.PASSWORD_CONFIRM]: {
            $set: (error && undefined) || confirm
          }
        }
      })
    );

    return error;
  };

  private validateSource = (source: string | undefined) => {
    source = (source || "").trim();

    this.setState(s =>
      update(s, {
        formValues: {
          [FORM_VALUES_KEY.SOURCE]: {
            $set: source || "password"
          }
        }
      })
    );

    return "";
  };

  private isFormEmpty = () => {
    for (const [key, val] of Object.entries(this.state.formValues)) {
      if (key !== FORM_VALUES_KEY.SOURCE && val !== undefined) {
        return false;
      }
    }

    return true;
  };
}

export default UserReg;
