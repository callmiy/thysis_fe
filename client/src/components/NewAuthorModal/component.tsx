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
import update from "immutability-helper";

import "./new-author-modal.scss";
import {
  FORM_OUTPUT_KEY,
  Props,
  State,
  FormValues,
  initialState
} from "./new-author-modal";
import { AuthorFrag } from "../../graphql/gen.types";
import { authorFullName } from "../../graphql/utils";
import SourceModal from "../../components/SourceModal";

export class NewAuthorModal extends React.Component<Props, State> {
  contentRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);

    this.state = update(initialState, {
      open: {
        $set: props.open
      }
    });

    const { author } = props;

    if (author) {
      this.initStateWithAuthor(author);
    }
  }

  render() {
    const { style, modal } = this.props;
    const { open, showSourceModal, createdAuthors } = this.state;

    if (showSourceModal && createdAuthors.length) {
      return <SourceModal open={true} authors={createdAuthors} />;
    }

    return modal ? (
      <Modal
        style={{ ...(style || {}), ...{ background: "#fff" } }}
        className="src-components-new-author-modal"
        basic={true}
        size="small"
        dimmer="inverted"
        open={open}
        onClose={this.onResetClicked(() => null)}
      >
        <div className="new-author-content" ref={this.contentRef}>
          <Modal.Content>
            {this.renderAuthorCreated()}

            <Header icon="user" content="Author Details" />

            {this.renderContent()}
          </Modal.Content>
        </div>
      </Modal>
    ) : (
      this.renderContent()
    );
  }

  renderContent = () => {
    return (
      <div>
        {this.renderError()}

        <Formik
          initialValues={this.state.initialFormOutput}
          enableReinitialize={true}
          onSubmit={this.submit}
          render={this.renderForm}
          validate={this.validate}
        />
      </div>
    );
  };

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

    return "";
  };

  validateFirstName = (firstName: string | null) => {
    if (!firstName) {
      return "";
    }

    return "";
  };

  validateMiddleName = (middleName: string | null) => {
    if (!middleName) {
      return "";
    }

    return "";
  };

  renderError = () => {
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

  onResetClicked = (reset: () => void) => () => {
    reset();
    this.props.dismissModal();
  };

  submit = async (values: FormValues, formikBag: FormikActions<FormValues>) => {
    formikBag.setSubmitting(true);
    const { author } = this.state;
    const { onAuthorCreated, createAuthor, authorUpdate } = this.props;

    try {
      if (!author) {
        const authorCreated = await (createAuthor &&
          createAuthor(this.eliminateEmptyFields(values)));

        if (
          authorCreated &&
          authorCreated.data &&
          authorCreated.data.createAuthor
        ) {
          const { createAuthor: createdAuthor } = authorCreated.data;

          if (onAuthorCreated) {
            onAuthorCreated(createdAuthor);
          } else {
            this.handleAuthorCreated(createdAuthor);
          }
        }

        formikBag.resetForm();
      } else {
        const authorUpdated = await (authorUpdate &&
          authorUpdate(author.id, this.prepFormForUpdate(values)));

        if (
          authorUpdated &&
          authorUpdated.data &&
          authorUpdated.data.updateAuthor
        ) {
          if (onAuthorCreated) {
            onAuthorCreated(authorUpdated.data.updateAuthor);
          }

          this.props.dismissModal();
          return;
        }
      }
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
      <div>
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
              disabled={isSubmitting}
              type="button"
            >
              <Icon name="remove" /> Dismiss
            </Button>

            <Button
              id="author-modal-reset"
              color="olive"
              basic={true}
              disabled={dirtyOrSubmitting}
              onClick={handleReset}
              type="button"
            >
              <Icon name="repeat" /> Reset
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
      </div>
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
    name: FORM_OUTPUT_KEY,
    form: FormikProps<FormValues>
  ) => () => {
    form.setFieldTouched(name, true);
  };

  private handleFocus = () => {
    this.setState({ graphQlError: undefined });
  };

  private eliminateEmptyFields = (values: FormValues) => {
    const data = {} as FormValues;

    for (let [k, val] of Object.entries(values)) {
      if (val) {
        val = val.trim();

        if (val) {
          data[k] = val;
        }
      }
    }

    return data;
  };

  private prepFormForUpdate = (values: FormValues) => {
    const data = {} as FormValues;

    for (const [k, val] of Object.entries(values)) {
      data[k] = val.trim() || null;
    }

    return data;
  };

  private initStateWithAuthor = (author: AuthorFrag) => {
    const start = {} as FormValues;
    Object.values(FORM_OUTPUT_KEY).forEach(k => {
      const val = author[k];
      start[k] = val || "";
    });

    this.state = update(this.state, {
      initialFormOutput: {
        $set: start
      },

      author: {
        $set: author
      }
    });
  };

  private renderAuthorCreated = () => {
    const { createdAuthors } = this.state;
    const len = createdAuthors.length;

    if (!len) {
      return;
    }

    return (
      <Message success={true}>
        <Message.Header className="authors-display-header">
          <span className="label">
            New author
            {len === 1 ? "" : "s"} ({len}
            ):
          </span>

          <Button
            compact={true}
            className="go-create-source"
            onClick={this.showCreateSourceModal}
          >
            Create source?
          </Button>
        </Message.Header>

        <ol className="authors-list">
          {createdAuthors.map(this.renderAuthor)}
        </ol>
      </Message>
    );
  };

  private renderAuthor = (author: AuthorFrag) => {
    return <li key={author.id}>{authorFullName(author)}</li>;
  };

  private showCreateSourceModal = () =>
    this.setState({ showSourceModal: true });

  private handleAuthorCreated = (author: AuthorFrag) => {
    this.setState(s =>
      update(s, {
        createdAuthors: {
          $push: [author]
        }
      })
    );

    if (this.contentRef.current) {
      this.contentRef.current.scrollTop = 0;
    }
  };
}

export default NewAuthorModal;
