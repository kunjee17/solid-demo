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
//ViewModel
export type UserViewModel = {
  id?: number;
  fullName: string;
  name: string;
};

// Model
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
      getUser(id: number) {
        const res = users() || [];
        return res.find((x) => x.id === id);
      },
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
