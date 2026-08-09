import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// HashRouter is required when running inside Capacitor (file:// scheme)
// BrowserRouter is used in normal web hosting.
const isCapacitor = typeof window !== "undefined" && (window).Capacitor !== undefined;
const Router = isCapacitor ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
