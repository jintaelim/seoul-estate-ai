import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BreakpointProvider } from "@seed-design/react";
import "@seed-design/css/base.css";
import App from "./App";
import "../styles.css";
import "./react.css";
import "./seed-theme.css";
import "./layout-fixes.css";
import "./mobile.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BreakpointProvider defaultBreakpoint="base">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BreakpointProvider>
  </StrictMode>,
);
