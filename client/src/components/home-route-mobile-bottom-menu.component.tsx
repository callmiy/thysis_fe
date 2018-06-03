import React from "react";
import {
  Menu,
  Icon,
  Button,
  Modal,
  Form,
  Input,
  Header
} from "semantic-ui-react";

// import { SimpleCss } from "../constants";

const styles = {
  container: {
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: 0 // clear semantic-ui style
  },

  newTagModalForm: {
    marginTop: "50%"
  }
}; // as SimpleCss;

interface NewTagModalFormProps {
  open: boolean;
  dismissModal: () => void;
}

interface NewTagModalFormState {
  text: string;
}

const initalStateNewTagModalFormState: NewTagModalFormState = {
  text: ""
};

class NewTagModalForm extends React.PureComponent<
  NewTagModalFormProps,
  NewTagModalFormState
> {
  state = initalStateNewTagModalFormState;

  constructor(props: NewTagModalFormProps) {
    super(props);

    ["handleChange"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { open } = this.props;

    return (
      <Modal
        style={styles.newTagModalForm}
        basic={true}
        size="small"
        open={open}
      >
        <Header icon="quote left" content="Subject matter of quote" />

        <Modal.Content>
          <Form.Field
            control={Input}
            placeholder="Tag text"
            fluid={true}
            onChange={this.handleChange}
          />
        </Modal.Content>

        <Modal.Actions>
          <Button basic={true} color="red" inverted={true} onClick={this.reset}>
            <Icon name="remove" /> Dismiss
          </Button>
          <Button color="green" inverted={true} disabled={!!!this.state.text}>
            <Icon name="checkmark" /> Ok
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  reset = () => {
    this.props.dismissModal();
    this.setState(initalStateNewTagModalFormState);
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    this.setState(s => ({ ...s, text: target.value }));
  };
}

interface NewQuoteMobileBottomMenuState {
  newTagOpened: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export default class NewQuoteMobileBottomMenu extends React.Component<
  {},
  NewQuoteMobileBottomMenuState
> {
  state: NewQuoteMobileBottomMenuState = {
    newTagOpened: false
  };

  constructor(props: {}) {
    super(props);

    ["toggleNewTagModal"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    return (
      <div style={styles.container}>
        <NewTagModalForm
          open={this.state.newTagOpened}
          dismissModal={this.toggleNewTagModal(false)}
        />
        <Menu
          pointing={true}
          icon="labeled"
          borderless={true}
          widths={3}
          style={styles.container}
        >
          <Menu.Item onClick={this.toggleNewTagModal(true)}>
            <Icon name="tag" />
            New Tag
          </Menu.Item>

          <Menu.Item>
            <Icon name="user" />
            New Source
          </Menu.Item>

          <Menu.Item>
            <Icon name="numbered list" />
            Tags
          </Menu.Item>
        </Menu>
      </div>
    );
  }

  toggleNewTagModal = (value: boolean) => () =>
    this.setState(s => ({ ...s, newTagOpened: value }));
}
