/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Router } from "@solidjs/router";

render(
  () => (
    <Router>
        <div class="container mx-auto pt-6">
        <App />
        </div>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
