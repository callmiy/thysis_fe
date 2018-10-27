import React from "react";
import { Modal } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";

import "./sources-modal.css";
import { SourceFullFrag } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import { makeSourceURL } from "../../routes/util";
import { styles } from "./styles";
import { modalStyle } from "./styles";
import { classes } from "./styles";
import { Props } from "./sources-modal";

export class SourcesModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        id="sources-modal"
        style={modalStyle}
        basic={true}
        open={this.props.open}
        onClose={this.resetModal}
        dimmer="inverted"
        className="sources-modal"
      >
        <Modal.Content>
          <div className={classes.content}>
            <div
              id="sources-modal-close"
              className={classes.modalClose}
              onClick={this.props.dismissModal}
            >
              &times;
            </div>

            {this.renderSources()}
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  renderSources = () => {
    const { error, dismissModal } = this.props;

    if (error) {
      return (
        <div className={classes.errorContainer} onClick={dismissModal}>
          {error.message}
        </div>
      );
    }

    if (this.props.loading) {
      return <Loader active={true} />;
    }

    const { sources, currentProject } = this.props;

    if (sources && sources.length) {
      return (
        <List style={styles.list} divided={true} relaxed={true}>
          {sources.map(this.renderSource)}
        </List>
      );
    }

    return (
      <div>No sources {`for "${currentProject && currentProject.title}"`}</div>
    );
  };

  renderSource = (source: SourceFullFrag) => {
    return (
      <List.Item
        key={source.id}
        style={styles.listItem}
        onClick={this.navigateTo(source.id)}
      >
        <List.Content>{sourceDisplay(source)}</List.Content>
      </List.Item>
    );
  };

  resetModal = () => {
    this.props.dismissModal();
  };

  navigateTo = (id: string) => () => {
    this.resetModal();
    this.props.history.push(makeSourceURL(id));
  };
}

export default SourcesModal;
