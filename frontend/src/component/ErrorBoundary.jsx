import React from "react";
// import * as Sentry from "@sentry/react";
import Toastify, { showToast } from "./Toastify.jsx"; // Import Toastify component and function

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
         {showToast("oOps! Something went wrong.", "error")}
         <Toastify />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
