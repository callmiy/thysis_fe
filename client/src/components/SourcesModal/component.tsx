import React from "react";
import { Modal } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";

import { SourceFrag } from "../../graphql/gen.types";
import { makeSourceURL } from "../../routes/util";
import { styles } from "./styles";
import { modalStyle } from "./styles";
import { classes } from "./styles";
import { Props } from "./utils";

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

    const { sources } = this.props;

    if (sources) {
      return (
        <List style={styles.list} divided={true} relaxed={true}>
          {sources.map(this.renderSource)}
        </List>
      );
    }

    return undefined;
  };

  renderSource = ({ id, display }: SourceFrag) => {
    return (
      <List.Item key={id} style={styles.listItem} onClick={this.navigateTo(id)}>
        <List.Content>{display}</List.Content>
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
