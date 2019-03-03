import * as React from "react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

interface ErrorBoundaryProps {
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  info?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Message
          error={true}
          icon={true}
          style={{
            marginTop: "20px"
          }}
          className={this.props.className || ""}
        >
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
            <div>{JSON.stringify(this.state.info, null, 2)}</div>
          </Message.Content>
        </Message>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
