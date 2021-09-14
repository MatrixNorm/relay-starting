import * as React from "react";
import type { Location } from "../routing/Router";

type Props = {
  location: Location;
};

type State = {
  hasError: boolean;
  location: Location;
};

export default class CatchError extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, location: props.location };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (nextProps.location.pathname !== state.location.pathname) {
      let nextState = { ...state, location: nextProps.location };
      if (nextState.hasError) {
        nextState.hasError = false;
      }
      return nextState;
    }
    return null;
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>SHIIIITEEEE</h1>;
    }
    return this.props.children;
  }
}
