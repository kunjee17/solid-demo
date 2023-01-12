import {
  createContext,
  createEffect,
  createResource,
  createSignal,
  Resource,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";

const UserContext = createContext<any[]>();

export type User = {
  id?: number;
  name: string;
};
export const url = `http://localhost:5000/users`;

export const fetchUsers = async () => (await fetch(url)).json();
export const UserProvider = (props: any) => {
  const [users, { mutate }] = createResource<User[]>(fetchUsers);
  const userRepo: any[] = [
    users,
    {
      setUsers: mutate,
    },
  ];
  return (
    <UserContext.Provider value={userRepo}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
