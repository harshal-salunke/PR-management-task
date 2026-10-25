import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RequisitionProvider } from "./context/RequisitionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RequisitionProvider>
        <App />
      </RequisitionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
