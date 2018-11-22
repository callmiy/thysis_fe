import React from "react";
import { Message, Modal, Header, Button } from "semantic-ui-react";
import update from "immutability-helper";

import "./home-new-author.scss";
import NewAuthorModal from "../../../components/NewAuthorModal";
import SourceModal from "../../../components/SourceModal";
import { Props, State, initialState } from "./home-new-author";
import { AuthorFrag } from "../../../graphql/gen.types";
import { authorFullName } from "../../../graphql/utils";

export class HomeNewAuthor extends React.Component<Props, State> {
  state = initialState;

  render() {
    const { childProps, newSourceModalProps } = this.props;
    const { showSourceModal, authors } = this.state;

    if (showSourceModal) {
      const nSMP = { ...newSourceModalProps, open: true };
      return <SourceModal {...nSMP} authors={authors} />;
    }

    return (
      <Modal
        style={{ ...(childProps.style || {}), ...{ background: "#fff" } }}
        basic={true}
        size="small"
        dimmer="inverted"
        open={childProps.open}
        className="home-new-author"
        onClose={this.dismissNewAuthorModal}
      >
        <Modal.Content className="home-new-author-content">
          {this.renderAuthorCreated()}

          <Header
            icon="user"
            content="Author Details"
            className="form-header"
          />

          <NewAuthorModal
            {...childProps}
            onAuthorCreated={this.handleAuthorCreated}
          />
        </Modal.Content>
      </Modal>
    );
  }

  private renderAuthorCreated = () => {
    const { authors } = this.state;
    const len = authors.length;

    if (!len) {
      return;
    }

    return (
      <Message success={true}>
        <Message.Header className="authors-display-header">
          <span>
            New author
            {len === 1 ? "" : "s"} ({len}
            ):
          </span>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            compact={true}
            className="go-create-source"
            onClick={this.showCreateSourceModal}
          >
            Create source?
          </Button>
        </Message.Header>

        <ol className="authors-list">{authors.map(this.renderAuthor)}</ol>
      </Message>
    );
  };

  private renderAuthor = (author: AuthorFrag) => {
    return <li key={author.id}>{authorFullName(author)}</li>;
  };

  private handleAuthorCreated = (author: AuthorFrag) => {
    this.setState(s =>
      update(s, {
        authors: {
          $push: [author]
        }
      })
    );
  };

  private dismissNewAuthorModal = () => {
    this.props.childProps.dismissModal();
  };

  private showCreateSourceModal = () =>
    this.setState({ showSourceModal: true });
}

export default HomeNewAuthor;
