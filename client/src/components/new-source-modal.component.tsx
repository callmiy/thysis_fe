import React from "react";
import { Formik, FormikProps, Field, FieldProps, FormikErrors } from "formik";
import { Form } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Card } from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";
import update from "immutability-helper";
import { Mutation } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { withRouter, RouteComponentProps } from "react-router-dom";

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
import { makeSourceURL } from "../constants";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: 0,
    background: "#fff"
  },

  formButtonsContainer: {
    display: "flex"
  },

  submitButton: {
    margin: "0 15px"
  },

  successCard: {
    backgroundColor: "#fcfff5",
    boxShadow: "0 0 0 1px #a3c293 inset, 0 0 0 0 transparent",
    margin: "auto"
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
  source?: SourceFragFragment;
}

const initialState: NewSourceModalState = {
  output: {}
};

interface NewSourceModalProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}

class NewSourceModal extends React.Component<
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
    const { source } = this.state;

    return (
      <Modal
        style={{ ...(style || {}), ...styles.modal }}
        basic={true}
        size="small"
        dimmer="inverted"
        open={open}
        onClose={this.resetModal}
      >
        {source && (
          <Card style={styles.successCard}>
            <Card.Content>
              <Card.Header style={{ color: "#a3c293" }}>Success</Card.Header>

              <Card.Description>{source.display}</Card.Description>

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
        )}

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
      const { data } = (await createSource()) as {
        data?: {
          createSource: SourceFragFragment;
        };
      };

      if (data) {
        this.setState(s =>
          update(s, {
            source: {
              $set: data.createSource
            }
          })
        );
      }

      formikBag.resetForm();
      formikBag.setSubmitting(false);
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
      <Form onSubmit={handleSubmit}>
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
            onClick={this.resetModal}
            disabled={isSubmitting}
          >
            <Icon name="remove" /> Dismiss
          </Button>

          <Button
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
        autoComplete="off"
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

    // tslint:disable-next-line:no-any
    const cacheWithData = cache as any;
    const rootQuery = cacheWithData.data.data.ROOT_QUERY;
    // Return if we have not previously fetched sources else apollo errors
    if (!rootQuery || !rootQuery.quotes) {
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

  goToSource = (id: string) => async () => {
    await this.setState(initialState);
    this.props.history.push(makeSourceURL(id));
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

export default withRouter(NewSourceModal);
