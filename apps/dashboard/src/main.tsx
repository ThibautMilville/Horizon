import React from "react";
import ReactDOM from "react-dom/client";

import {App} from "@/app/App";
import "@/shared/styles/index.scss";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
