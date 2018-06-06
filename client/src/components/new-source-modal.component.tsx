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
import SOURCE_QUERY from "../graphql/sources-1.query";
import { CreateSourceFn, CreateSourceUpdateFn } from "../graphql/ops.types";
import {
  CreateSourceInput,
  SourceTypeFragFragment,
  Sources1Query,
  SourceFragFragment
} from "../graphql/gen.types";
import SourceTypeControl from "./select-source-type-control.component";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: 0
  },

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
  publication: string;
  url: string;
}

const initialFormValues: FormValues = {
  sourceType: null,
  author: "",
  topic: "",
  publication: "",
  url: ""
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
      "renderTextControlFormik",
      "validatesourceType",
      "validateauthor",
      "validatetopic",
      "validatepublication",
      "validateurl",
      "resetModal",
      "renderTextControl",
      "writeSourcesToCache"
    ].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { open, style } = this.props;

    return (
      <Modal
        style={{ ...(style || {}), ...styles.modal }}
        basic={true}
        size="small"
        open={open}
        onClose={this.resetModal}
      >
        <Header icon="user" content="Create quote source" />

        <Modal.Content>
          <Mutation
            mutation={SOURCE_MUTATION}
            variables={{ source: this.state.output }}
            update={this.writeSourcesToCache}
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

  submit = (createSource: CreateSourceFn) => async (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    try {
      await createSource();
      formikBag.resetForm();
      setTimeout(this.resetModal, 2300);
    } catch (error) {
      formikBag.setSubmitting(false);
    }
  };

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
      <Form onSubmit={handleSubmit} inverted={true}>
        <Field name="sourceType" render={this.renderSourceTypeControl} />

        {[
          { name: "author", label: "Author name(s)" },
          { name: "topic" },
          { name: "publication" },
          { name: "url" }
        ].map(this.renderTextControl)}

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

  resetModal = async () => {
    await this.setState(initialState);
    this.props.dismissModal();
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

  writeSourcesToCache: CreateSourceUpdateFn = (
    cache,
    { data: createSource }
  ) => {
    if (!createSource) {
      return;
    }

    const sourcesQuery = cache.readQuery({
      query: SOURCE_QUERY
    }) as Sources1Query;

    const sources = sourcesQuery.sources as SourceFragFragment[];

    cache.writeQuery({
      query: SOURCE_QUERY,
      data: {
        sources: [createSource.createSource, ...sources]
      }
    });
  };

  validatesourceType = (sourceType: SourceTypeFragFragment | null) => {
    if (!sourceType) {
      return "Select a source type";
    }

    this.setState(prev =>
      update(prev, {
        output: {
          sourceTypeId: {
            $set: sourceType.id
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
