import { create } from "zustand";

export interface User {
  id: string;
  username: string;
}

export interface UserStore {
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
}

export const useUser = create<UserStore>((setter) => ({
  user: {},
  setUser: (user) => setter({ user: user }),
}));
