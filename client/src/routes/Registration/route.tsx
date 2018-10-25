import React from "react";
import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Formik } from "formik";
import { FormikProps } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { FormikErrors } from "formik";
import isEmpty from "lodash/isEmpty";

import { Mutation } from "react-apollo";
import update from "immutability-helper";

import "./reg.css";
import REG_USER_MUTATION from "../../graphql/user-reg.mutation";
import { UserRegFn } from "../../graphql/ops.types";
import { initialState, initialFormValues } from "./utils";
import { Props } from "./utils";
import { State } from "./utils";
import { FORM_VALUES_KEY } from "./utils";
import { FormValues } from "./utils";
import { setTitle } from "../../routes/util";
import RootHeader from "../../components/header.component";
import { USER_LOCAL_STORAGE_KEY } from "../../constants";
// import { initialFormAttrs } from "./utils";

export class UserReg extends React.Component<Props, State> {
  state = initialState;

  componentDidMount() {
    setTitle("Sign Up");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    const { formValues } = this.state;

    return (
      <div className="user-reg-route">
        <RootHeader title="Sign Up" />

        {this.renderErrorOrSuccess()}

        <Mutation
          mutation={REG_USER_MUTATION}
          variables={{ registration: formValues }}
        >
          {regUser => {
            return (
              <Formik
                initialValues={this.state.initialFormValues}
                enableReinitialize={true}
                onSubmit={this.submit(regUser)}
                render={this.renderForm}
                validate={this.validate}
              />
            );
          }}
        </Mutation>
      </div>
    );
  }

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      let error;
      if (key === FORM_VALUES_KEY.PASSWORD_CONFIRM) {
        error = this.validatePasswordConfirm(
          values[FORM_VALUES_KEY.PASSWORD_CONFIRM],
          values[FORM_VALUES_KEY.PASSWORD]
        );
      } else {
        error = error = this[
          `validate${key.charAt(0).toUpperCase()}${key.slice(1)}`
        ](values[key]);
      }

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  validateName = (name: string | null) => {
    if (!name) {
      return "Enter name";
    }

    if (name.length < 2) {
      return "Too short";
    }

    this.setState(prev =>
      update(prev, {
        formValues: {
          name: {
            $set: name
          }
        }
      })
    );

    return "";
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

  validatePasswordConfirm = (confirm: string, pwd: string) => {
    if (!confirm) {
      return "Confirm Password";
    }

    if (confirm !== pwd) {
      return "Passwords don't match";
    }

    this.setState(prev =>
      update(prev, {
        formValues: {
          [FORM_VALUES_KEY.PASSWORD_CONFIRM]: {
            $set: confirm
          }
        }
      })
    );

    return "";
  };

  validateSource = (source: string | null) => {
    if (!source) {
      return "Enter Auth Source";
    }

    this.setState(prev =>
      update(prev, {
        formValues: {
          [FORM_VALUES_KEY.SOURCE]: {
            $set: source
          }
        }
      })
    );

    return "";
  };

  renderErrorOrSuccess = () => {
    const { graphQlError } = this.state;

    if (graphQlError) {
      return (
        <Message icon={true} error={true}>
          <Icon name="ban" />

          <Message.Content>
            <Message.Header>An error has occurred</Message.Header>

            {graphQlError.message}
          </Message.Content>
        </Message>
      );
    }

    return undefined;
  };

  handleChange = (key: FORM_VALUES_KEY) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = e;
    this.setState(s =>
      update(s, {
        formValues: {
          [key]: {
            $set: target.value
          }
        }
      })
    );
  };

  private submit = (createAuthor: UserRegFn) => async (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    try {
      const result = await createAuthor();

      if (result && result.data) {
        const user = result.data.registration;
        localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));

        this.setState(s =>
          update(s, {
            formValues: {
              $set: initialFormValues
            }
          })
        );

        this.props.history.replace("/");
      }
    } catch (error) {
      formikBag.setSubmitting(false);

      this.setState(s =>
        update(s, {
          graphQlError: {
            $set: error
          }
        })
      );
    }
  };

  private renderForm = ({
    handleReset,
    dirty,
    isSubmitting,
    errors,
    handleSubmit
  }: FormikProps<FormValues>) => {
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors);

    return (
      <Form onSubmit={handleSubmit} className="main">
        {[
          ["Name", "text", FORM_VALUES_KEY.NAME],
          ["Email", "email", FORM_VALUES_KEY.EMAIL],
          ["Password", "password", FORM_VALUES_KEY.PASSWORD],
          ["Password Confirm", "password", FORM_VALUES_KEY.PASSWORD_CONFIRM],
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px"
          }}
        >
          <Button
            id="author-modal-close"
            basic={true}
            color="red"
            onClick={handleReset}
            disabled={dirtyOrSubmitting}
          >
            <Icon name="remove" /> Reset
          </Button>

          <Button
            id="author-modal-submit"
            color="green"
            inverted={true}
            disabled={disableSubmit}
            loading={isSubmitting}
            type="submit"
          >
            <Icon name="checkmark" /> Ok
          </Button>
        </div>
      </Form>
    );
  };

  private renderInput = (label: string, type: string) => (
    formProps: FieldProps<FormValues>
  ) => {
    const { field, form } = formProps;
    const name = field.name as FORM_VALUES_KEY;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <div>
        <Form.Field
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
          {...field}
        />

        {booleanError &&
          touched && (
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
    this.setState(s => {
      return update(s, {
        graphQlError: {
          $set: undefined
        },

        submitSuccess: {
          $set: false
        }
      });
    });
  };
}

export default UserReg;
