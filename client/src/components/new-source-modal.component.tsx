import React from "react";
import { Formik, FormikProps, Field, FieldProps, FormikErrors } from "formik";
import {
  Icon,
  Button,
  Modal,
  Input,
  Header,
  Message,
  Form
} from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";
import update from "immutability-helper";
import { Mutation } from "react-apollo";
import isEmpty from "lodash/isEmpty";

import SOURCE_MUTATION from "../graphql/source.mutation";
import { CreateSourceFn } from "../graphql/ops.types";
import {
  CreateSourceInput,
  SourceTypeFragFragment
} from "../graphql/gen.types";
import SourceTypeControl from "./select-source-type-control.component";

jss.setup(preset());

const styles = {
  formButtonsContainer: {
    display: "flex"
  },

  submitButton: {
    margin: "0 15px"
  }
};

const { classes } = jss.createStyleSheet(styles).attach();

interface FormValues {
  sourceType: SourceTypeFragFragment | null;
  author: string;
  topic: string;
  publication?: string | null;
  url?: string | null;
}

const initialFormValues: FormValues = {
  sourceType: null,
  author: "",
  topic: ""
};

export type FormValuesProps = FieldProps<FormValues>;

interface NewSourceModalState {
  output: Partial<CreateSourceInput>;
}

const initialState: NewSourceModalState = {
  output: {}
};

interface NewSourceModalProps {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}

export default class NewSourceModal extends React.Component<
  NewSourceModalProps,
  NewSourceModalState
> {
  state = initialState;

  constructor(props: NewSourceModalProps) {
    super(props);

    [
      "submit",
      "renderForm",
      "validate",
      "renderSourceTypeControl",
      "renderAuthorControl",
      "validatesourceType",
      "validateauthor",
      "validatetopic",
      "validatepublication",
      "validateurl",
      "resetModal"
    ].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { open, style } = this.props;

    return (
      <Modal style={{ ...(style || {}) }} basic={true} size="small" open={open}>
        <Header icon="user" content="Create quote source" />

        <Modal.Content>
          <Mutation
            mutation={SOURCE_MUTATION}
            variables={{ source: this.state.output }}
          >
            {createSource => {
              return (
                <Formik
                  initialValues={initialFormValues}
                  enableReinitialize={true}
                  onSubmit={this.submit(createSource)}
                  render={this.renderForm}
                  validate={this.validate}
                />
              );
            }}
          </Mutation>
        </Modal.Content>
      </Modal>
    );
  }

  submit = (createSource: CreateSourceFn) => (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => 1;

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      const error = this[`validate${key}`](values[key]);

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  renderForm = ({
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
        <Field name="sourceTypes" render={this.renderSourceTypeControl} />
        <Field name="author" render={this.renderAuthorControl} />

        <div className={classes.formButtonsContainer}>
          <Button
            basic={true}
            color="red"
            inverted={true}
            onClick={this.resetModal}
            disabled={isSubmitting}
          >
            <Icon name="remove" /> Dismiss
          </Button>

          <Button
            style={styles.submitButton}
            color="green"
            inverted={true}
            disabled={disableSubmit}
            loading={isSubmitting}
          >
            <Icon name="checkmark" /> Ok
          </Button>

          <Button
            basic={true}
            color="red"
            inverted={true}
            onClick={handleReset}
            disabled={dirtyOrSubmitting}
          >
            <Icon name="remove" /> Reset
          </Button>
        </div>
      </Form>
    );
  };

  resetModal = () => {
    this.props.dismissModal();
    this.setState(initialState);
  };

  renderSourceTypeControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <Form.Field
        control={SourceTypeControl}
        label="Select source type"
        error={booleanError}
        selectError={booleanError}
        {...formProps}
      >
        {booleanError && touched && <Message error={true} header={error} />}
      </Form.Field>
    );
  };

  renderAuthorControl = (formProps: FieldProps<FormValues>) => {
    const { field, form } = formProps;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;
    // const touched = form.touched[name];
    const label = "Author name(s)";

    return (
      <Form.Field
        control={Input}
        placeholder={label}
        label={label}
        id={name}
        error={booleanError}
        {...field}
      />
    );
  };

  validatesourceType = (sourceType: SourceTypeFragFragment | null) => {
    if (!sourceType) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          sourceType: {
            $set: sourceType
          }
        }
      })
    );

    return "";
  };

  validateauthor = (author: string | null) => {
    if (!author) {
      return "Enter author name(s)";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          author: {
            $set: author
          }
        }
      })
    );

    return "";
  };

  validatetopic = (topic: string | null) => {
    if (!topic) {
      return "Enter source topic according to author(s)";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          topic: {
            $set: topic
          }
        }
      })
    );

    return "";
  };

  validatepublication = (publication: string | null) => {
    if (!publication) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          publication: {
            $set: publication
          }
        }
      })
    );

    return "";
  };

  validateurl = (url: string | null) => {
    if (!url) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          url: {
            $set: url
          }
        }
      })
    );

    return "";
  };
}
