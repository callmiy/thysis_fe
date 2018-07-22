import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { Form, Input } from "semantic-ui-react";

jss.setup(preset());

const styles = {
  volumeIssue: {
    border: "1px solid #22242626",
    outline: 0,
    padding: "0.3em",
    borderRadius: "0.2em",
    textAlign: "center",
    justifyContent: "center"
  },

  volumeInput: {
    flexGrow: [1, "!important"]
  },

  issueInput: {
    flexGrow: [1, "!important"]
  }
  // tslint:disable-next-line:no-any
} as any;

const { classes } = jss.createStyleSheet(styles).attach();

export interface VolumeIssueType {
  volume?: string | null;
  issue?: string | null;
}

interface State {
  volumeIssue: VolumeIssueType;
}

interface VolumeIssueProps {
  value?: VolumeIssueType;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value?: VolumeIssueType) => void;
  onBlur?: () => void;
}

export default class VolumeIssue extends React.Component<
  VolumeIssueProps,
  State
> {
  static getDerivedStateFromProps(next: VolumeIssueProps, currentState: State) {
    // The value was reset by user of component so we sync the state
    if (!next.value) {
      return { volumeIssue: {} };
    }

    return null;
  }

  state: State = {
    volumeIssue: {}
  };

  constructor(props: VolumeIssueProps) {
    super(props);

    ["handleChange"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { volume, issue } = this.state.volumeIssue;

    return (
      <Form.Group
        className={`${classes.volumeIssue} ${this.props.className || ""}`}
        inline={true}
      >
        <Form.Field
          className={classes.volumeInput}
          control={Input}
          value={volume || ""}
          label="Volume"
          placeholder="Volume"
          fluid={true}
          onChange={this.handleChange("volume")}
        />

        <Form.Field
          className={classes.issueInput}
          control={Input}
          value={issue || ""}
          label="Issue"
          placeholder="Issue"
          fluid={true}
          onChange={this.handleChange("issue")}
        />
      </Form.Group>
    );
  }

  handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onBlur, onChange } = this.props;

    if (onBlur) {
      onBlur();
    }

    const target = e.target;
    let { volumeIssue } = this.state;
    volumeIssue = { ...volumeIssue, [name]: target.value };
    this.setState(prev => ({ ...prev, volumeIssue }));

    if (onChange) {
      onChange(volumeIssue);
    }
  };
}
