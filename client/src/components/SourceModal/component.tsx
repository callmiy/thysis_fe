import React from "react";
import { FormikProps } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { Form } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Card } from "semantic-ui-react";
import isEmpty from "lodash/isEmpty";

import { CreateSource_createSource } from "../../graphql/gen.types";
import { AuthorFrag } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import SourceTypeControlComponent from "../SourceTypeControl";
import AuthorsControlComponent from "../AuthorsControl";
import { makeSourceURL } from "../../routes/util";
import { styles } from "./styles";
import { classes } from "./styles";
import { modalStyle } from "./styles";
import { Props } from "./source-modal";
import { State } from "./source-modal";
import { initialState } from "./source-modal";
import { FormValues } from "./source-modal";

export class SourceModal extends React.Component<Props, State> {
  state = initialState;

  render() {
    const { open, style } = this.props;

    return (
      <Modal
        style={{ ...(style || {}), ...modalStyle }}
        basic={true}
        size="small"
        dimmer="inverted"
        open={open}
        onClose={this.resetModal}
      >
        {this.renderErrorOrSuccess()}

        <Header icon="user" content="Create quote source" />

        <Modal.Content>{this.renderForm()}</Modal.Content>
      </Modal>
    );
  }

  submit = async () => {
    const { createSource, values, setSubmitting, resetForm } = this.props;

    if (!createSource) {
      this.setState({
        formError: { message: "You have not selected a project" }
      });

      return;
    }

    setSubmitting(true);

    try {
      const result = await createSource(values);

      setSubmitting(false);
      resetForm();

      if (!result) {
        return;
      }

      const data = result.data;

      if (!data) {
        return;
      }

      const source = data.createSource as CreateSource_createSource;
      this.setState({ source });
    } catch (error) {
      this.setState({ formError: error });
      setSubmitting(false);
    }
  };

  renderForm = () => {
    const { handleReset, dirty, isSubmitting, errors } = this.props;
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors);

    return (
      <Form className={classes.form} onSubmit={this.submit}>
        <Field name="sourceType" render={this.renderSourceTypeControl} />
        <Field name="authors" render={this.renderAuthorsControl} />

        {[
          { name: "topic" },
          { name: "year" },
          { name: "publication" },
          { name: "url" }
        ].map(this.renderTextControl)}

        <div className={classes.formButtonsContainer}>
          <Button
            id="source-modal-close"
            basic={true}
            color="red"
            onClick={this.resetModal}
            disabled={isSubmitting}
          >
            <Icon name="remove" /> Dismiss
          </Button>

          <Button
            id="source-modal-submit"
            style={styles.submitButton}
            color="green"
            disabled={disableSubmit}
            loading={isSubmitting}
          >
            <Icon name="checkmark" /> Ok
          </Button>

          <Button
            basic={true}
            color="red"
            onClick={handleReset}
            disabled={dirtyOrSubmitting}
          >
            <Icon name="remove" /> Reset
          </Button>
        </div>
      </Form>
    );
  };

  resetModal = async () => {
    await this.setState(initialState);
    this.props.dismissModal();
  };

  renderErrorOrSuccess = () => {
    const { formError, source } = this.state;

    if (formError) {
      return (
        <Message icon={true} error={true}>
          <Icon name="ban" />

          <Message.Content>
            <Message.Header>An error has occurred</Message.Header>

            {formError.message}
          </Message.Content>
        </Message>
      );
    }

    if (source) {
      return (
        <Card style={styles.successCard}>
          <Card.Content>
            <Card.Header style={{ color: "#a3c293" }}>Success</Card.Header>

            <Card.Description>{sourceDisplay(source)}</Card.Description>

            <Card.Content extra={true}>
              <div className="ui two buttons">
                <Button
                  basic={true}
                  color="green"
                  onClick={this.goToSource(source.id)}
                >
                  Go to source
                </Button>
                <Button basic={true} color="red" onClick={this.resetModal}>
                  Dismiss
                </Button>
              </div>
            </Card.Content>
          </Card.Content>
        </Card>
      );
    }

    return undefined;
  };

  handleFocus = () =>
    this.setState({ formError: undefined, source: undefined });

  renderSourceTypeControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name, value },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={SourceTypeControlComponent}
          label="Select source type"
          error={booleanError}
          selectError={booleanError}
          name={name}
          value={value}
          onFocus={this.handleFocus}
          handleBlur={this.handleFormControlBlur(name, form)}
          handleChange={this.handleControlChange(name, form)}
        />

        {this.renderFieldError(booleanError && touched, error)}
      </div>
    );
  };

  renderAuthorsControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name, value },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={AuthorsControlComponent}
          label="Select authors"
          error={booleanError}
          selectError={booleanError}
          onFocus={this.handleFocus}
          name={name}
          value={value}
          handleBlur={this.handleFormControlBlur(name, form)}
          handleChange={this.handleControlChange(name, form)}
        />

        {this.renderFieldError(booleanError && touched, error)}
      </div>
    );
  };

  renderTextControl = ({ name, label }: { name: string; label?: string }) => {
    label = label ? label : name.charAt(0).toUpperCase() + name.slice(1);

    return (
      <Field
        key={name}
        name={name}
        render={this.renderTextControlFormik(label)}
      />
    );
  };

  renderTextControlFormik = (label: string) => (
    formProps: FieldProps<FormValues>
  ) => {
    const { field, form } = formProps;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={Input}
          placeholder={label}
          label={label}
          id={name}
          error={booleanError}
          autoComplete="off"
          onFocus={this.handleFocus}
          {...field}
        />

        {this.renderFieldError(booleanError && touched, error)}
      </div>
    );
  };

  renderFieldError = (show: boolean, error: string) => {
    return show ? (
      <div className={classes.errorMessage}> {error} </div>
    ) : (
      undefined
    );
  };

  handleFormControlBlur = (
    name: string,
    form: FormikProps<FormValues>
  ) => () => {
    form.setFieldTouched(name, true);
  };

  handleControlChange = (name: string, form: FormikProps<FormValues>) => (
    val: undefined | AuthorFrag
  ) => form.setFieldValue(name, val);

  goToSource = (id: string) => async () => {
    await this.setState(initialState);
    this.props.dismissModal();
    this.props.history.push(makeSourceURL(id));
  };
}

export default SourceModal;
