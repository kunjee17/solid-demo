import { Routes } from "@solidjs/router";
import { Component, createResource, createSignal, For, Show } from "solid-js";

type User = {
  id?: number;
  name: string;
};

const url = `http://localhost:5000/users`;

const fetchUsers = async () => (await fetch(url)).json();

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

const List: Component<{ users: User[] }> = ({ users }) => {
  return (
    <ul>
      <For each={users}>
        {(user, i) => (
          <li>
            {i} - {user.name}
          </li>
        )}
      </For>
    </ul>
  );
};

const App: Component = () => {
  const [users, { refetch, mutate }] = createResource<User[]>(fetchUsers);
  const [name, setName] = createSignal<string>("");
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
        onclick={async () => {
          const res = await addUser({
            name: name(),
          });
          mutate([
            ...(users() || []),
            {
              name: name(),
            },
          ]);
          setName("");
        }}
      >
        Submit
      </button>
      <span>{users.loading && "Loading..."}</span>
      <Show when={users.latest}>
        <List users={users() || []} />
      </Show>
    </div>
  );
};

export default App;
