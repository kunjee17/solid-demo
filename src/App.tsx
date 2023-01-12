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
  console.log("users", users);
  return (
    <div>
      <ul>
        <For each={users}>
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
  const [users, loading, { get, setUsers }] = useUser();
  const [name, setName] = createSignal<string>("");
  createEffect(async () => {
    await get();
  });
  return (
    <div>
      <p>loading - {loading.toString()}</p>
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
          setUsers([...users, { name: name() }]);
          setName("");
        }}
      >
        Submit
      </button>
      <List />
    </div>
  );
};

export default App;
