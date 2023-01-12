/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App, { UserProvider } from "./App";
import { Router } from "@solidjs/router";

render(
  () => (
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
