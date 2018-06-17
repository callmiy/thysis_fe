import React from "react";
import { Icon, Button, Modal, Input, Header, Message } from "semantic-ui-react";

import { Mutation } from "react-apollo";
import update from "immutability-helper";

import TAG_MUTATION from "../../graphql/tag.mutation";
import { CreateTagFn, CreateTagUpdateFn } from "../../graphql/ops.types";
import { TagsMinimalQuery } from "../../graphql/gen.types";
import { TagFragFragment } from "../../graphql/gen.types";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { initalStateNewTagModalFormState } from "./utils";
import { NewTagModalFormProps } from "./utils";
import { NewTagModalFormState } from "./utils";

export class NewTagModalForm extends React.PureComponent<
  NewTagModalFormProps,
  NewTagModalFormState
> {
  state = initalStateNewTagModalFormState;

  constructor(props: NewTagModalFormProps) {
    super(props);

    ["handleChange", "handleSubmit", "handleFocus", "writeTagsToCache"].forEach(
      fn => (this[fn] = this[fn].bind(this))
    );
  }

  render() {
    const { open, style } = this.props;
    const { text, formError, submitting, submitSuccess } = this.state;

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

          <Input
            placeholder="Tag text"
            fluid={true}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            error={!!formError}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px"
            }}
          >
            <Button
              basic={true}
              color="red"
              onClick={this.reset}
              disabled={submitting}
            >
              <Icon name="remove" /> Dismiss
            </Button>

            <Mutation
              mutation={TAG_MUTATION}
              variables={{ tag: { text } }}
              update={this.writeTagsToCache}
            >
              {createTag => {
                return (
                  <Button
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

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    this.setState(s =>
      update(s, {
        text: {
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

  writeTagsToCache: CreateTagUpdateFn = (cache, { data: createTag }) => {
    if (!createTag) {
      return;
    }

    const tag = createTag.createTag as TagFragFragment;

    if (this.props.onTagCreated) {
      this.props.onTagCreated(tag);
    }

    // tslint:disable-next-line:no-any
    const cacheWithData = cache as any;
    const rootQuery = cacheWithData.data.data.ROOT_QUERY;

    // no component has already fetched tags so we do not have any in the
    // cache
    if (!rootQuery) {
      return;
    }

    try {
      const tagsQuery = cache.readQuery({
        query: TAGS_QUERY
      }) as TagsMinimalQuery;

      const tags = tagsQuery.tags as TagFragFragment[];

      if (tags) {
        cache.writeQuery({
          query: TAGS_QUERY,
          data: {
            tags: [tag, ...tags]
          }
        });
      }
    } catch (error) {
      //  tslint:disable-next-line:no-console
      console.log(
        `


      logging starts


      error writing new tag to cache:\n`,
        error,
        `

      logging ends


      `
      );
    }
  };
}

export default NewTagModalForm;
