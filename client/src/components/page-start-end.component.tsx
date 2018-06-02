import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { Form, Input } from "semantic-ui-react";

jss.setup(preset());

const styles = {
  page: {
    border: "1px solid #22242626",
    outline: 0,
    padding: "0.3em",
    borderRadius: "0.2em",
    textAlign: "center",
    justifyContent: "center"
  },

  startInput: {
    flexGrow: [1, "!important"]
  },

  endInput: {
    flexGrow: [1, "!important"]
  }
  // tslint:disable-next-line:no-any
} as any;

const { classes } = jss.createStyleSheet(styles).attach();

export interface PageType {
  start?: number | null;
  end?: number | null;
}

interface State {
  page: PageType;
  errors: { [key: string]: boolean };
}

interface PageProps {
  value?: PageType;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value?: PageType) => void;
  onBlur?: () => void;
}

export default class Page extends React.PureComponent<PageProps, State> {
  state: State = {
    page: {},
    errors: {}
  };

  constructor(props: PageProps) {
    super(props);

    ["handleChange", "handleKeyPress", "getError"].forEach(
      fn => (this[fn] = this[fn].bind(this))
    );
  }

  componentWillReceiveProps(next: PageProps) {
    // The value was reset by user of component so we sync the state
    if (!next.value && this.props.value) {
      this.setState({ page: {}, errors: {} });
    }
  }

  render() {
    const { start, end } = this.state.page;

    return (
      <Form.Group
        className={`${classes.page} ${this.props.className || ""}`}
        inline={true}
      >
        <Form.Field
          className={classes.startInput}
          control={Input}
          type="number"
          value={start || ""}
          label="Page start"
          placeholder="Page start"
          fluid={true}
          onChange={this.handleChange("start")}
          onKeyPress={this.handleKeyPress}
          error={this.getError("start")}
        />

        <Form.Field
          className={classes.endInput}
          control={Input}
          type="number"
          value={end || ""}
          label="Page end"
          placeholder="Page end"
          fluid={true}
          onChange={this.handleChange("end")}
          onKeyPress={this.handleKeyPress}
          error={this.getError("end")}
        />
      </Form.Group>
    );
  }

  getError = (name: string) => {
    const err = this.state.errors[name];
    return err === undefined ? false : err;
  };

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onBlur, onChange } = this.props;

    if (onBlur) {
      onBlur();
    }

    const target = e.target;
    const value = +target.value;
    let { page, errors } = this.state;
    page = { ...page, [name]: value };

    if (name === "end" && !page.start) {
      errors = { start: errors.start, end: true };
    } else {
      errors = { start: false, end: false };
    }

    this.setState(prev => ({ ...prev, page, errors }));

    if (onChange) {
      onChange(page);
    }
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };
}
