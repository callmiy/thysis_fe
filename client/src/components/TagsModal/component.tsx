import React from "react";
import { Modal, List } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";

import { TagsMinimalQueryComponent } from "../../graphql/ops.types";
import { TagsMinimalQueryResult } from "../../graphql/ops.types";
import { TagFrag } from "../../graphql/gen.types";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { makeTagURL } from "../../routes/util";
import { styles } from "../SourcesModal/styles";
import { modalStyle } from "../SourcesModal/styles";
import { classes } from "../SourcesModal/styles";
import { Props } from "./utils";

export class TagsModal extends React.Component<Props> {
  render() {
    const { open } = this.props;

    return (
      <TagsMinimalQueryComponent query={TAGS_QUERY}>
        {dataProps => {
          return (
            <Modal
              style={modalStyle}
              basic={true}
              dimmer="inverted"
              open={open}
              onClose={this.resetModal}
            >
              <Modal.Content>
                <div id="tag-list-modal" className={classes.content}>
                  <div
                    id="tag-list-modal-close"
                    className={classes.modalClose}
                    onClick={this.props.dismissModal}
                  >
                    &times;
                  </div>

                  {this.renderTags(dataProps)}
                </div>
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
        <div
          className={classes.errorContainer}
          onClick={this.props.dismissModal}
        >
          {error.message}
        </div>
      );
    }

    if (loading) {
      return <Loader active={true} />;
    }

    const tags = data ? data.tags : null;

    if (tags) {
      return (
        <List style={styles.list} divided={true} relaxed={true}>
          {tags.map(this.renderTag)}
        </List>
      );
    }

    return undefined;
  };

  renderTag = ({ id, text, question }: TagFrag) => {
    return (
      <List.Item
        key={id}
        style={styles.listItem}
        id={id}
        onClick={this.navigateTo(id)}
      >
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
