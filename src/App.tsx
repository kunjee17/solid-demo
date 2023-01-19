import { Routes } from "@solidjs/router";
import {
  Component,
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Show,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

const getUser = async () => {
  const res = await fetch(`${url}/1`);
  const resJ: User = await res.json();
  return resJ;
};

const UserContext = createContext<any[]>();
//ViewModel
export type UserViewModel = {
  id?: number;
  fullName?: string;
  name?: string;
};

// Model
export type User = {
  id?: number;
  name: string;
};
export const url = `http://localhost:5000/users`;

export const UserProvider = (props: any) => {
  const [user, { mutate }] = createResource<User>(getUser);
  const userRepo: any[] = [
    user,
    {
      getView() {
        return {
          id: user.latest?.id,
          name: user.latest?.name,
          fullName: user.latest?.name + " Surname",
        };
      },
      mutate,
    },
  ];
  return (
    <UserContext.Provider value={userRepo}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

const updateUser = async (item: User) => {
  const res = await fetch(`${url}/1`, {
    method: "PUT",
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



const UserDetailDetail: Component<{ item: () => string }> = ({ item }) => {
  return <p> User Detail Detail {item()}</p>;
};

const UserDetail: Component<{ fullName: () => string }> = ({ fullName }) => {
  return (
    <div>
      <br />
      <h1>User Detail</h1>
      <h4>{fullName()}</h4>
      <UserDetailDetail item={fullName} />
    </div>
  );
};

const App: Component = () => {
  const [id, _] = createSignal(1);
  const [user, { mutate }] = createResource(id, getUser);
  const [name, setName] = createSignal<string>("");
  const fullName = createMemo(() => {
    return user.latest?.name + ' Surname';
  });
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
          const res = await updateUser({
            name: name(),
          });
          mutate({
            id: user.latest!.id,
            name: name(),
          });
          setName("");
        }}
      >
        Submit
      </button>
      {/* <Show when={users.latest}>
        <List />
      </Show> */}
      <Show when={user.loading}>Loading...</Show>
      <Show when={user.latest}>
        <p>
          {user.latest?.id} - {user.latest?.name}
        </p>
        <UserDetail fullName={fullName} />
      </Show>
    </div>
  );
};

export default App;
