import {Component, type ReactNode} from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  resetKey?: string;
};

type ErrorBoundaryState = {
  failed: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {failed: false};

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {failed: true};
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.failed && previousProps.resetKey !== this.props.resetKey) {
      this.setState({failed: false});
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
