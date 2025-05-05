import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// 🌟 2️⃣ Disable console errors in production to hide them from users
if (process.env.NODE_ENV === "production") {
  console.error = () => {};
  console.warn = () => {};
}

// 🌟 3️⃣ Render app inside Error Boundary
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export const SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8000";
