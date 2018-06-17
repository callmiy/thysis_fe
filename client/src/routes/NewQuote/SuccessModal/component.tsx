import * as React from "react";
import { Icon } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

import { ShouldReUseSource } from "../utils";
import { modalStyle } from "./styles";
import { contentStyle } from "./styles";
import { messageIconStyle } from "./styles";
import { classes } from "./styles";

interface NewQuoteRouteSuccessModalProps {
  open: boolean;
  dismiss: (shouldUseSource: ShouldReUseSource) => () => void;
  reUseSource: boolean;
}

export class SuccessModal extends React.Component<
  NewQuoteRouteSuccessModalProps
> {
  render() {
    const { reUseSource } = this.props;

    return (
      <Modal style={modalStyle} dimmer="inverted" open={this.props.open}>
        <Modal.Content style={contentStyle}>
          <div className={classes.messageContainer}>
            <Icon style={messageIconStyle} name="thumbs up" />

            <div>
              <div className={classes.messageHeader}>
                Quote successfully created
              </div>

              {!reUseSource && (
                <div className={classes.messageAction}>
                  Create another quote for this source?
                </div>
              )}
            </div>
          </div>

          {this.renderButtons()}
        </Modal.Content>
      </Modal>
    );
  }

  renderButtons = () => {
    if (this.props.reUseSource) {
      return (
        <div className={`single ${classes.buttonsContainer}`}>
          <Button
            color="red"
            inverted={true}
            onClick={this.props.dismiss(ShouldReUseSource.DO_NOT_RE_USE_SOURCE)}
          >
            <Icon name="remove" /> Dismiss
          </Button>
        </div>
      );
    }

    return (
      <div className={classes.buttonsContainer}>
        <Button
          color="red"
          inverted={true}
          onClick={this.props.dismiss(ShouldReUseSource.DO_NOT_RE_USE_SOURCE)}
        >
          <Icon name="remove" /> Nope
        </Button>

        <Button
          color="green"
          inverted={true}
          onClick={this.props.dismiss(ShouldReUseSource.RE_USE_SOURCE)}
        >
          <Icon name="checkmark" /> Ok
        </Button>
      </div>
    );
  };
}

export default SuccessModal;
