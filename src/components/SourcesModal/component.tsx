import React from "react";
import { Modal, Message, List, Loader } from "semantic-ui-react";

import "./sources-modal.scss";
import { SourceFullFrag } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import { makeSourceURL } from "../../routes/util";
import { Props } from "./sources-modal";

export class SourcesModal extends React.Component<Props> {
  render() {
    return (
      <Modal
        id="sources-modal"
        basic={true}
        open={this.props.open}
        onClose={this.resetModal}
        dimmer="inverted"
        className="src-components-sources-modal"
      >
        <Modal.Content>
          <div
            id="sources-modal-close"
            className="modal-close"
            onClick={this.props.dismissModal}
          >
            &times;
          </div>

          {this.renderSources()}
        </Modal.Content>
      </Modal>
    );
  }

  renderSources = () => {
    const { error, dismissModal } = this.props;

    if (error) {
      return (
        <div className="error-container" onClick={dismissModal}>
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
        <List divided={true} relaxed={true}>
          {sources.map(this.renderSource)}
        </List>
      );
    }

    return (
      <Message className="no-resources-message">
        <Message.Content>
          No sources for {` "${currentProject && currentProject.title}"`}
        </Message.Content>
      </Message>
    );
  };

  renderSource = (source: SourceFullFrag | null) => {
    if (!source) {
      return undefined;
    }

    return (
      <List.Item
        key={source.id}
        className="list-item"
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
