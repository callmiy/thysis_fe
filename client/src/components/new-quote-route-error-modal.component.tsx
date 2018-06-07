import * as React from "react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { ApolloError } from "apollo-client/errors/ApolloError";
import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../constants";

jss.setup(preset());

const modalStyle = {
  marginTop: "20px"
} as React.CSSProperties;

const styles = {
  modal: {
    "&.ui.visible > .content": {
      padding: ["0", "!important;"]
    }
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

interface NewQuoteRouteErrorModalProps {
  open: boolean;
  dismiss: () => void;
  error: ApolloError;
}

export class NewQuoteRouteErrorModal extends React.Component<
  NewQuoteRouteErrorModalProps
> {
  render() {
    return (
      <Modal
        style={modalStyle}
        className={classes.modal}
        dimmer="inverted"
        open={this.props.open}
        onClose={this.props.dismiss}
      >
        <Modal.Content>
          <Message error={true} icon={true}>
            <Icon name="ban" />

            <Message.Content>
              <Message.Header
                style={{
                  borderBottom: "1px solid",
                  display: "inline-block",
                  marginBottom: "10px"
                }}
              >
                An error has occurred
              </Message.Header>
              <div>{JSON.stringify(this.props.error, null, 2)}</div>
            </Message.Content>
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.props.dismiss}>
            <Icon name="remove" /> Dismiss
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default NewQuoteRouteErrorModal;
