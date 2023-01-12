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
  const [users, setUsers] = createStore<User[]>([]);
  const [loading, setLoading] = createSignal(false);
  const userRepo: any[] = [
    users,
    loading(),
    {
      async get() {
        console.log("getting users");
        setLoading(true);
        const users: User[] = await fetchUsers();
        console.log(users);
        setUsers(users);
        setLoading(false);
      },
      setUsers,
    },
  ];
  return (
    <UserContext.Provider value={userRepo}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
