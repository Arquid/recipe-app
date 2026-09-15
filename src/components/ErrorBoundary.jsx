import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Recipe Finder crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rs-error" style={{ maxWidth: 480, margin: "40px auto" }}>
            Something went wrong. Try reloading the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
