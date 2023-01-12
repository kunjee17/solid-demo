import { Routes } from "@solidjs/router";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { url, User, useUser } from "./Context";

const addUser = async (item: User) => {
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(item),
  });
  return res.json();
};

const List: Component = () => {
  const [users] = useUser();
  console.log("users", users.latest);
  return (
    <div>
      <ul>
        <For each={users.latest}>
          {(user, i) => (
            <li>
              {i} - {user.name}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

const App: Component = () => {
  const [users, { setUsers }] = useUser();
  const [name, setName] = createSignal<string>("");
  createEffect(async () => {});
  return (
    <div>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-accent w-full max-w-xs"
        oninput={(x) => setName(x.target.value)}
        value={name()}
      />
      <button
        class="btn btn-primary"
        onclick={async () => {
          const res = await addUser({
            name: name(),
          });
          setUsers([...users.latest, { name: name() }]);
          setName("");
        }}
      >
        Submit
      </button>
      <Show when={users.latest}>
        <List />
      </Show>
    </div>
  );
};

export default App;
