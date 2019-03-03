import * as React from "react";
import { Icon } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { ApolloError } from "apollo-client/errors/ApolloError";
import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";
import { ERROR_COLOR } from "../../utils/colors";
import { ERROR_BG_COLOR } from "../../utils/colors";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: "20px",
    maxHeight: "40%"
  },

  content: {
    color: ERROR_COLOR,
    backgroundColor: ERROR_BG_COLOR
  },

  error: {
    flex: 1,
    padding: 20,
    textAlign: "center"
  },

  buttonContainer: {
    flexShrink: 0,
    textAlign: "right",
    padding: "0 0 5px 0"
  }
} as SimpleCss;

const modalStyle = styles.modal as React.CSSProperties;
const errorStyle = styles.error as React.CSSProperties;
const buttonContainerStyle = styles.buttonContainer as React.CSSProperties;

interface NewQuoteRouteErrorModalProps {
  open: boolean;
  dismiss: () => void;
  error: ApolloError;
}

export class ErrorModal extends React.Component<NewQuoteRouteErrorModalProps> {
  render() {
    return (
      <Modal
        style={modalStyle}
        dimmer="inverted"
        open={this.props.open}
        onClose={this.props.dismiss}
      >
        <Modal.Content style={styles.content}>
          <div style={errorStyle}>{this.props.error.message}</div>

          <div style={buttonContainerStyle}>
            <Button color="red" onClick={this.props.dismiss}>
              <Icon name="remove" /> Dismiss
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ErrorModal;
