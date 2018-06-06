import React from "react";
import { Icon, Button, Modal, Input, Header, Message } from "semantic-ui-react";

import { Mutation } from "react-apollo";
import update from "immutability-helper";

import TAG_MUTATION from "../graphql/tag.mutation";
import { CreateTagFn, CreateTagUpdateFn } from "../graphql/ops.types";
import { TagsMinimalQuery, TagFragFragment } from "../graphql/gen.types";
import TAG_QUERY from "../graphql/tags-mini.query";

interface NewTagModalFormProps {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
}

interface NewTagModalFormState {
  text: string;
  formError?: string;
  submitting: boolean;
  submitSuccess: boolean;
}

const initalStateNewTagModalFormState: NewTagModalFormState = {
  text: "",
  formError: undefined,
  submitting: false,
  submitSuccess: false
};

export default class NewTagModalForm extends React.PureComponent<
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
        style={{ ...(style || {}) }}
        basic={true}
        size="small"
        open={open}
        onClose={this.reset}
      >
        <Header icon="quote left" content="Subject matter of quote" />

        <Modal.Content>
          <Input
            placeholder="Tag text"
            fluid={true}
            inverted={true}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            error={!!formError}
          />

          {formError && <Message error={true} content={formError} />}

          {submitSuccess && (
            <Message
              error={true}
              success={true}
              content="Tag created successfully!"
            />
          )}
        </Modal.Content>

        <Modal.Actions>
          <Button
            basic={true}
            color="red"
            inverted={true}
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
                  disabled={!!formError || text.length < 2 || submitting}
                  onClick={this.handleSubmit(createTag)}
                  loading={submitting}
                >
                  <Icon name="checkmark" /> Ok
                </Button>
              );
            }}
          </Mutation>
        </Modal.Actions>
      </Modal>
    );
  }

  reset = async () => {
    await this.setState(initalStateNewTagModalFormState);
    this.props.dismissModal();
  };

  handleFocus = () =>
    this.setState(s =>
      update(s, {
        formError: {
          $set: undefined
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

      setTimeout(this.reset, 2300);
    } catch (error) {
      this.setState(s =>
        update(s, {
          formError: {
            $set: JSON.stringify(error.graphQLErrors, null, 2)
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

    // tslint:disable-next-line:no-any
    const cacheWithData = cache as any;
    const rootQuery = cacheWithData.data.data.ROOT_QUERY;

    // no component has already fetched tags so we do not have any in the
    // cache
    if (!rootQuery || !rootQuery.quotes) {
      return;
    }

    const tagsQuery = cache.readQuery({
      query: TAG_QUERY
    }) as TagsMinimalQuery;

    const tags = tagsQuery.tags as TagFragFragment[];

    cache.writeQuery({
      query: TAG_QUERY,
      data: {
        tags: [createTag.createTag, ...tags]
      }
    });
  };
}
