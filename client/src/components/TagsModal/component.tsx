import React from "react";
import { Modal, List, Message, Loader } from "semantic-ui-react";

import "./tags-modal.css";
import { TagsMinimalQueryComponent } from "../../graphql/ops.types";
import { TagsMinimalQueryResult } from "../../graphql/ops.types";
import { TagFrag } from "../../graphql/gen.types";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { makeTagURL } from "../../routes/util";
import { Props } from "./utils";

export class TagsModal extends React.Component<Props> {
  render() {
    const { open } = this.props;

    return (
      <TagsMinimalQueryComponent query={TAGS_QUERY}>
        {dataProps => {
          return (
            <Modal
              className="src-components-tags-modal"
              basic={true}
              dimmer="inverted"
              open={open}
              onClose={this.resetModal}
            >
              <Modal.Content>
                <div
                  id="tag-list-modal-close"
                  className="modal-close"
                  onClick={this.props.dismissModal}
                >
                  &times;
                </div>

                {this.renderTags(dataProps)}
              </Modal.Content>
            </Modal>
          );
        }}
      </TagsMinimalQueryComponent>
    );
  }

  renderTags = ({ loading, data, error }: TagsMinimalQueryResult) => {
    if (error) {
      return (
        <div className="error-container" onClick={this.props.dismissModal}>
          {error.message}
        </div>
      );
    }

    if (loading) {
      return <Loader active={true} />;
    }

    const tags = data ? data.tags : null;

    if (tags && tags.length) {
      return (
        <List divided={true} relaxed={true}>
          {tags.map(this.renderTag)}
        </List>
      );
    }

    return (
      <Message className="no-resources-message">
        <Message.Content>No tags for "current project"</Message.Content>
      </Message>
    );
  };

  renderTag = ({ id, text, question }: TagFrag) => {
    return (
      <List.Item key={id} id={id} onClick={this.navigateTo(id)}>
        <List.Content>
          <div>{text}</div>
          {question && (
            <div
              style={{
                paddingLeft: "10%",
                fontStyle: "italic"
              }}
            >
              {question}
            </div>
          )}
        </List.Content>
      </List.Item>
    );
  };

  resetModal = () => {
    this.props.dismissModal();
  };

  private navigateTo = (id: string) => () => {
    this.resetModal();
    this.props.history.push(makeTagURL(id));
  };
}

export default TagsModal;
