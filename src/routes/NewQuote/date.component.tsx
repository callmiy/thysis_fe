import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { Form, Input } from "semantic-ui-react";

jss.setup(preset());

const styles = {
  date: {
    border: "1px solid #22242626",
    outline: 0,
    padding: "0.3em",
    borderRadius: "0.2em",
    textAlign: "center"
  },

  dateDayInput: {
    flexGrow: [1, "!important"]
  },

  dateMonthInput: {
    flexGrow: [1, "!important"]
  },

  dateYearInput: {
    padding: ["0px", "!important"],
    flexGrow: [2, "!important"]
  }
  // tslint:disable-next-line:no-any
} as any;

const { classes } = jss.createStyleSheet(styles).attach();

export interface DateType {
  day?: number | null;
  month?: number | null;
  year?: number | null;
}

interface State {
  date: DateType;
  errors: { [key: string]: boolean };
}

interface DateProps {
  value?: DateType;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value?: DateType) => void;
  onBlur?: () => void;
}

export default class Date extends React.Component<DateProps, State> {
  static getDerivedStateFromProps(nextProps: DateProps, nextState: State) {
    // The value was reset by user of component so we sync the state
    if (!nextProps.value) {
      return { date: {}, errors: {} };
    }

    return null;
  }

  state: State = { date: {}, errors: {} };

  constructor(props: DateProps) {
    super(props);

    ["handleChange", "handleKeyPress", "getError"].forEach(
      fn => (this[fn] = this[fn].bind(this))
    );
  }

  render() {
    const { day, month, year } = this.state.date;

    return (
      <Form.Group
        className={`${classes.date} ${this.props.className || ""}`}
        inline={true}
      >
        <Form.Field
          className={classes.dateDayInput}
          control={Input}
          type="number"
          value={day || ""}
          min={1}
          max={31}
          maxLength={2}
          label="Day"
          placeholder="Day"
          fluid={true}
          onChange={this.handleChange("day")}
          onKeyPress={this.handleKeyPress}
          error={this.getError("day")}
        />

        <Form.Field
          className={classes.dateMonthInput}
          control={Input}
          type="number"
          value={month || ""}
          min={1}
          max={12}
          maxLength={2}
          label="Month"
          placeholder="Month"
          fluid={true}
          onChange={this.handleChange("month")}
          onKeyPress={this.handleKeyPress}
          error={this.getError("month")}
        />

        <Form.Field
          className={classes.dateYearInput}
          control={Input}
          type="number"
          value={year || ""}
          min={1000}
          max={9999}
          maxLength={4}
          label="Year"
          placeholder="Year"
          fluid={true}
          onChange={this.handleChange("year")}
          onKeyPress={this.handleKeyPress}
          error={this.getError("year")}
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

    const min = +target.min;
    const max = +target.max;
    const value = +target.value;
    const realVal = value < min || value > max ? null : value;
    let { date, errors } = this.state;
    date = { ...date, [name]: value };
    errors = { ...errors, [name]: !!!realVal };
    this.setState(prev => ({ ...prev, date, errors }));

    if (onChange) {
      onChange({ ...date, [name]: realVal });
    }
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const len = target.value.length;

    const tooMany = len > 0 && len > target.maxLength - 1;

    if (tooMany || [".", ","].includes(e.key)) {
      e.preventDefault();
    }
  };
}
