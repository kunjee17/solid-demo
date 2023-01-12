/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Router } from "@solidjs/router";
import { UserProvider } from "./Context";

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
