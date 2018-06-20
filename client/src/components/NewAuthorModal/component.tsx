import React from "react";
import { Icon, Button, Modal, Input, Header, Message } from "semantic-ui-react";

import { Mutation } from "react-apollo";
import update from "immutability-helper";

import CREATE_AUTHOR_MUTATION from "../../graphql/create-author.mutation";
import { CreateAuthorFn, CreateAuthorUpdateFn } from "../../graphql/ops.types";
import { GetAllAuthorsQuery } from "../../graphql/gen.types";
import { AuthorFragFragment } from "../../graphql/gen.types";
import AUTHORS_QUERY from "../../graphql/authors.query";
import { initalStateNewTagModalFormState } from "./utils";
import { NewAuthorModalProps } from "./utils";
import { NewAuthorModalState } from "./utils";

export class NewAuthorModal extends React.PureComponent<
  NewAuthorModalProps,
  NewAuthorModalState
> {
  state = initalStateNewTagModalFormState;

  render() {
    const { open, style } = this.props;
    const { name, formError, submitting, submitSuccess } = this.state;

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
            placeholder="Author name"
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
              mutation={CREATE_AUTHOR_MUTATION}
              variables={{ author: { name } }}
              update={this.writeAuthorToCache}
            >
              {createAuthor => {
                return (
                  <Button
                    color="green"
                    inverted={true}
                    disabled={
                      !!formError ||
                      name.length < 2 ||
                      submitting ||
                      submitSuccess
                    }
                    onClick={this.handleSubmit(createAuthor)}
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
          content="Author created successfully!"
        />
      );
    }

    return undefined;
  };

  reset = () => {
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
        name: {
          $set: target.value
        }
      })
    );
  };

  handleSubmit = (createAuthor: CreateAuthorFn) => async () => {
    try {
      this.setState(s =>
        update(s, {
          submitting: {
            $set: true
          }
        })
      );

      await createAuthor();

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

  writeAuthorToCache: CreateAuthorUpdateFn = (
    cache,
    { data: createAuthor }
  ) => {
    if (!createAuthor) {
      return;
    }

    const author = createAuthor.createAuthor as AuthorFragFragment;

    if (this.props.onAuthorCreated) {
      this.props.onAuthorCreated(author);
    }

    // tslint:disable-next-line:no-any
    const cacheWithData = cache as any;
    const rootQuery = cacheWithData.data.data.ROOT_QUERY;

    // no component has already fetched authors so we do not have any in the
    // cache
    if (!rootQuery) {
      return;
    }

    try {
      const authorsQuery = cache.readQuery({
        query: AUTHORS_QUERY
      }) as GetAllAuthorsQuery;

      const authors = authorsQuery.authors as AuthorFragFragment[];

      if (authors) {
        cache.writeQuery({
          query: AUTHORS_QUERY,
          data: {
            authors: [author, ...authors]
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

export default NewAuthorModal;
