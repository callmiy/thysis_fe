import React from "react";
import { Modal, List, Segment } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import jss from "jss";
import preset from "jss-preset-default";

import { TagsMinimalRunQuery } from "../graphql/ops.types";
import { TagFragFragment } from "../graphql/gen.types";
import TAGS_QUERY from "../graphql/tags-mini.query";
import {
  FLEX_DIRECTION_COLUMN,
  OVERFLOW_X_HIDDEN,
  OVERFLOW_Y_AUTO,
  makeTagDetailURL
} from "../constants";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: "10%",
    overflowX: OVERFLOW_X_HIDDEN,
    // overflowY: OVERFLOW_Y_AUTO,
    display: "flex",
    flexDirection: FLEX_DIRECTION_COLUMN,
    flex: 1,
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: 0, // clear semantic-ui style
    minWidth: "100%"
  },

  modalContent: {
    maxHeight: "calc(90vh)"
  },

  segment: {
    overflowY: OVERFLOW_Y_AUTO
  }
};

interface TagListModalProps {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}

export default class TagListModal extends React.PureComponent<
  TagListModalProps
> {
  render() {
    const { open } = this.props;

    return (
      <Modal
        className={`aja`}
        style={styles.modal}
        basic={true}
        size="fullscreen"
        open={open}
        closeIcon={true}
        onClose={this.resetModal}
        dimmer="blurring"
      >
        <Modal.Content style={styles.modalContent} scrolling={true}>
          <TagsMinimalRunQuery query={TAGS_QUERY}>
            {({ data }) => {
              const tags = data ? data.tags : ([] as TagFragFragment[]);

              return (
                <Segment style={styles.segment} inverted={true}>
                  <List divided={true} inverted={true} relaxed={true}>
                    {(tags || []).map(this.renderTag)}
                  </List>
                </Segment>
              );
            }}
          </TagsMinimalRunQuery>
        </Modal.Content>
      </Modal>
    );
  }

  renderTag = ({ id, text }: TagFragFragment) => {
    return (
      <List.Item key={id} as={NavLink} to={makeTagDetailURL(id)}>
        <List.Content>{text}</List.Content>
      </List.Item>
    );
  };

  resetModal = () => {
    this.props.dismissModal();
  };
}
