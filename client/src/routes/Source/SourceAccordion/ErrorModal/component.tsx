import * as React from "react";
import { Icon } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

import { modalStyle } from "./styles";
import { contentStyle } from "./styles";
import { messageIconStyle } from "./styles";
import { classes } from "./styles";
import { errorStyle } from "./styles";

interface Props {
  open: boolean;
  dismiss: () => void;
  error: { message: string };
}

export class ErrorModal extends React.Component<Props> {
  render() {
    const { dismiss, open } = this.props;

    return (
      <Modal style={modalStyle} dimmer="inverted" open={open} onClose={dismiss}>
        <Modal.Content style={contentStyle}>
          <div className={classes.messageContainer}>
            <Icon style={messageIconStyle} name="warning" />

            <div className={classes.cotent}>
              <div className={classes.messageHeader}>
                Source successfully updated!
              </div>

              <div style={errorStyle}>{this.props.error.message}</div>
            </div>
          </div>

          <div className={`${classes.buttonsContainer}`}>
            <Button color="red" inverted={true} onClick={dismiss}>
              <Icon name="remove" /> Dismiss
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ErrorModal;
