import React from "react";
import { Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Formik } from "formik";
import { FormikProps } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { FormikErrors } from "formik";
import isEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import { initialState, initialFormOutput } from "./new-author-modal";
import { Props } from "./new-author-modal";
import { State } from "./new-author-modal";
import { FORM_OUTPUT_KEY } from "./new-author-modal";
import { FormValues } from "./new-author-modal";

export class NewAuthorModal extends React.Component<Props, State> {
  state = initialState;

  render() {
    const { open, style } = this.props;

    return (
      <Modal
        style={{ ...(style || {}), ...{ background: "#fff" } }}
        basic={true}
        size="small"
        dimmer="inverted"
        open={open}
        onClose={this.onResetClicked(() => null)}
      >
        <Header icon="user" content="Author Details" />

        <Modal.Content>
          {this.renderErrorOrSuccess()}

          <Formik
            initialValues={this.state.initialFormOutput}
            enableReinitialize={true}
            onSubmit={this.submit}
            render={this.renderForm}
            validate={this.validate}
          />
        </Modal.Content>
      </Modal>
    );
  }

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      const error = this[
        `validate${key.charAt(0).toUpperCase()}${key.slice(1)}`
      ](values[key]);

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  validateLastName = (lastName: string | null) => {
    if (!lastName) {
      return "Enter last name";
    }

    if (lastName.length < 2) {
      return "Too short";
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          lastName: {
            $set: lastName
          }
        }
      })
    );

    return "";
  };

  validateFirstName = (firstName: string | null) => {
    if (!firstName) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          firstName: {
            $set: firstName
          }
        }
      })
    );

    return "";
  };

  validateMiddleName = (middleName: string | null) => {
    if (!middleName) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          middleName: {
            $set: middleName
          }
        }
      })
    );

    return "";
  };

  renderErrorOrSuccess = () => {
    const { graphQlError, submitSuccess } = this.state;

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

    if (submitSuccess) {
      return (
        <Message
          error={true}
          success={true}
          content="Author created successfully!"
        />
      );
    }

    return undefined;
  };

  onResetClicked = (reset: () => void) => () => {
    reset();
    this.props.dismissModal();
  };

  handleChange = (key: FORM_OUTPUT_KEY) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { target } = e;
    this.setState(s =>
      update(s, {
        formOutputs: {
          [key]: {
            $set: target.value
          }
        }
      })
    );
  };

  submit = async (values: FormValues, formikBag: FormikProps<FormValues>) => {
    formikBag.setSubmitting(true);

    try {
      await (this.props.createAuthor &&
        this.props.createAuthor(this.eliminateEmptyFields(values)));

      this.setState(s =>
        update(s, {
          submitSuccess: {
            $set: true
          },

          formOutputs: {
            $set: initialFormOutput
          }
        })
      );

      formikBag.resetForm();
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
      <Form onSubmit={handleSubmit}>
        {[
          ["Last Name", FORM_OUTPUT_KEY.LAST_NAME],
          ["First Name", FORM_OUTPUT_KEY.FIRST_NAME],
          ["Middle Names", FORM_OUTPUT_KEY.MIDDLE_NAMES]
        ].map(data => {
          const [label, name] = data;
          return (
            <Field key={name} name={name} render={this.renderInput(label)} />
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
            onClick={this.onResetClicked(handleReset)}
            disabled={dirtyOrSubmitting}
          >
            <Icon name="remove" /> Dismiss
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

  private renderInput = (label: string) => (
    formProps: FieldProps<FormValues>
  ) => {
    const { field, form } = formProps;
    const name = field.name as FORM_OUTPUT_KEY;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <div>
        <Form.Field
          control={Input}
          placeholder={label}
          autoComplete="off"
          label={label}
          id={name}
          error={booleanError}
          onBlur={this.handleFormControlBlur(name, form)}
          onFocus={this.handleFocus}
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
    name: FORM_OUTPUT_KEY,
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

  private eliminateEmptyFields = (values: FormValues) => {
    const data = {} as FormValues;

    for (const [k, val] of Object.entries(values)) {
      if (val) {
        data[k] = val;
      }
    }

    return data;
  };
}

export default NewAuthorModal;
