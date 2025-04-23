import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QuestionProvider } from "./context/QuestionContext";
import { UserActivityProvider } from "./context/UserActivityContext";
import ErrorBoundary from "./component/ErrorBoundary"; // Import the Error Boundary
import * as Sentry from "@sentry/react";

// 🌟 1️⃣ Initialize Sentry for error logging
Sentry.init({
  dsn: "https://95c07129d2367c0bc913b7030ebe0cf6@o4508812754092032.ingest.us.sentry.io/4508812798394368",
  environment: process.env.NODE_ENV,
});

// 🌟 2️⃣ Disable console errors in production to hide them from users
if (process.env.NODE_ENV === "production") {
  console.error = () => {};
  console.warn = () => {};
}

// 🌟 3️⃣ Render app inside Error Boundary
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <UserActivityProvider>
      <QuestionProvider>
        <App />
      </QuestionProvider>
    </UserActivityProvider>
  </ErrorBoundary>
);

export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://apis.setuqverse.com"
    : "http://localhost:5000";

reportWebVitals();

