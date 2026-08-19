import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { resolveRoute } from "./routes";
import "./styles.css";

const container = document.getElementById("root")!;
const application = (
  <React.StrictMode>
    <App route={resolveRoute(window.location.pathname)} />
  </React.StrictMode>
);

if (container.hasChildNodes()) hydrateRoot(container, application);
else createRoot(container).render(application);
