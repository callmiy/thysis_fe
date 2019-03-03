import React from "react";
import { Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Formik } from "formik";
import { FormikProps, FormikActions } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { FormikErrors } from "formik";
import isEmpty from "lodash/isEmpty";

import { initialState } from "./new-source-type-modal";
import { Props } from "./new-source-type-modal";
import { State } from "./new-source-type-modal";
import { FormValues } from "./new-source-type-modal";

export class NewSourceTypeModal extends React.Component<Props, State> {
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
        <Header icon="user" content="Source Type Details" />

        <Modal.Content>
          {this.renderErrorOrSuccess()}

          <Formik
            initialValues={this.state.initialFormValues}
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
      ](values[key].trim());

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  validateName = (name: string | null) => {
    if (!name) {
      return "Enter source name";
    }

    if (name.length < 2) {
      return "Too short";
    }

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
          content="Source created successfully!"
        />
      );
    }

    return undefined;
  };

  onResetClicked = (reset: () => void) => () => {
    reset();
    this.props.dismissModal();
  };

  submit = async (values: FormValues, formikBag: FormikActions<FormValues>) => {
    formikBag.setSubmitting(true);

    try {
      await (this.props.createSourceType &&
        this.props.createSourceType(values.name.trim()));
      this.setState({ submitSuccess: true });

      formikBag.resetForm();
    } catch (error) {
      formikBag.setSubmitting(false);
      this.setState({ graphQlError: error });
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
        {[["Source Name", "name"]].map(data => {
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
            id="source-type-modal-close"
            basic={true}
            color="red"
            onClick={this.onResetClicked(handleReset)}
            disabled={isSubmitting}
            type="button"
          >
            <Icon name="remove" /> Dismiss
          </Button>

          <Button
            id="source-type-modal-submit"
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
    const name = field.name;
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
    name: string,
    form: FormikProps<FormValues>
  ) => () => {
    form.setFieldTouched(name, true);
  };

  private handleFocus = () => {
    this.setState({
      graphQlError: undefined,
      submitSuccess: false
    });
  };
}

export default NewSourceTypeModal;
