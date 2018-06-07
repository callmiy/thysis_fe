import * as React from "react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Modal } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../constants";
import { ShouldReUseSource } from "../routes/new-quote.route";

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

interface NewQuoteRouteSuccessModalProps {
  open: boolean;
  dismiss: (shouldUseSource: ShouldReUseSource) => () => void;
  reUseSource: boolean;
}

export class NewQuoteRouteSuccessModal extends React.Component<
  NewQuoteRouteSuccessModalProps
> {
  render() {
    const { reUseSource } = this.props;

    return (
      <Modal
        style={modalStyle}
        className={classes.modal}
        dimmer="inverted"
        open={this.props.open}
      >
        <Modal.Content>
          <Message success={true} icon={true}>
            <Icon name="thumbs up" />

            <Message.Content>
              <Message.Header
                style={{
                  borderBottom: "1px solid",
                  display: "inline-block",
                  marginBottom: "10px"
                }}
              >
                Quote successfully created
              </Message.Header>

              {!reUseSource && (
                <span>Create another quote for this source?</span>
              )}
            </Message.Content>
          </Message>
        </Modal.Content>
        {!reUseSource && (
          <Modal.Actions>
            <Button
              color="red"
              inverted={true}
              onClick={this.props.dismiss(
                ShouldReUseSource.DO_NOT_RE_USE_SOURCE
              )}
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
          </Modal.Actions>
        )}

        {reUseSource && (
          <Modal.Actions>
            <Button
              color="red"
              inverted={true}
              onClick={this.props.dismiss(
                ShouldReUseSource.DO_NOT_RE_USE_SOURCE
              )}
            >
              <Icon name="remove" /> Dismiss
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    );
  }
}

export default NewQuoteRouteSuccessModal;
