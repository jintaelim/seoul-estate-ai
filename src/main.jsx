import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@seed-design/css/base.css";
import App from "./App";
import "../styles.css";
import "./react.css";
import "./seed-theme.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
