import React from "react";
import { Form } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Message } from "semantic-ui-react";

import { Mutation } from "react-apollo";
import update from "immutability-helper";

import TAG_MUTATION from "../../graphql/tag.mutation";
import { CreateTagFn, CreateTagUpdateFn } from "../../graphql/ops.types";
import { TagsMinimal as TagsMinimalQuery } from "../../graphql/gen.types";
import { TagFrag } from "../../graphql/gen.types";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { initialState } from "./utils";
import { Props } from "./utils";
import { State } from "./utils";

export class NewTagModalForm extends React.Component<Props, State> {
  state = initialState;

  render() {
    const { open, style } = this.props;
    const { text, question, formError, submitting, submitSuccess } = this.state;

    return (
      <Modal
        style={{ ...(style || {}), ...{ background: "#fff" } }}
        basic={true}
        size="small"
        dimmer="inverted"
        open={open}
        onClose={this.reset}
      >
        <Header icon="quote left" content="Subject matter of quote" />

        <Modal.Content>
          {this.renderErrorOrSuccess()}

          <Form>
            <Form.Field
              control={Input}
              name="tag"
              placeholder="Tag text"
              label="Tag text"
              fluid={true}
              onChange={this.handleChange("text")}
              onFocus={this.handleFocus}
              error={!!formError}
            />

            <Form.Field
              control={Input}
              name="question"
              placeholder="Question"
              label="Question"
              fluid={true}
              onChange={this.handleChange("question")}
              onFocus={this.handleFocus}
              error={!!formError}
            />
          </Form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px"
            }}
          >
            <Button
              id="tag-modal-close"
              basic={true}
              color="red"
              onClick={this.reset}
              disabled={submitting}
            >
              <Icon name="remove" /> Dismiss
            </Button>

            <Mutation
              mutation={TAG_MUTATION}
              variables={{ tag: { text, question } }}
              update={this.writeTagsToCache}
            >
              {createTag => {
                return (
                  <Button
                    id="tag-modal-submit"
                    color="green"
                    inverted={true}
                    disabled={
                      !!formError ||
                      text.length < 2 ||
                      submitting ||
                      submitSuccess
                    }
                    onClick={this.handleSubmit(createTag)}
                    loading={submitting}
                  >
                    <Icon name="checkmark" /> Ok
                  </Button>
                );
              }}
            </Mutation>
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  renderErrorOrSuccess = () => {
    const { formError, submitSuccess } = this.state;

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

    if (submitSuccess) {
      return (
        <Message
          error={true}
          success={true}
          content="Tag created successfully!"
        />
      );
    }

    return undefined;
  };

  reset = async () => {
    // React complained I'm calling set state on an unmounted componnent?
    // await this.setState(initalStateNewTagModalFormState);
    this.props.dismissModal();
  };

  handleFocus = () =>
    this.setState(s =>
      update(s, {
        formError: {
          $set: undefined
        },

        submitSuccess: {
          $set: false
        }
      })
    );

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    this.setState(s =>
      update(s, {
        [name]: {
          $set: target.value
        }
      })
    );
  };

  handleSubmit = (createTag: CreateTagFn) => async () => {
    try {
      this.setState(s =>
        update(s, {
          submitting: {
            $set: true
          }
        })
      );

      await createTag();

      this.setState(s =>
        update(s, {
          submitSuccess: {
            $set: true
          },

          submitting: {
            $set: false
          }
        })
      );
    } catch (error) {
      this.setState(s =>
        update(s, {
          formError: {
            $set: error
          },

          submitting: {
            $set: false
          }
        })
      );
    }
  };

  writeTagsToCache: CreateTagUpdateFn = async (cache, { data: createTag }) => {
    if (!createTag) {
      return;
    }

    const tag = createTag.createTag as TagFrag;

    if (this.props.onTagCreated) {
      this.props.onTagCreated(tag);
    } else {
      return;
    }

    const query = {
      query: TAGS_QUERY
    };

    try {
      const tagsQuery = cache.readQuery<TagsMinimalQuery>(query);

      cache.writeQuery({
        ...query,
        data: update(tagsQuery, {
          tags: {
            $push: [tag]
          }
        })
      });
    } catch (error) {
      if (error.message.startsWith("Can't find field tags on object")) {
        return;
      }

      throw error;
    }
  };
}

export default NewTagModalForm;
