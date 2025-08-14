import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  googleAccount: boolean;
  wishList?: string[];
}

interface IUserStore {
  user: IUser | null;
  access_token: string | null;
  isAuthenticated: boolean;
  login: (user: IUser, access_token: string) => void;
  setProfile: (user: IUser) => void;
  logout: () => void;
  setAccessToken: (access_token: string) => void;
}

const userStore = create<IUserStore>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      isAuthenticated: false,

      login: (user, access_token) => {
        set({ user, access_token, isAuthenticated: true });
      },

      setProfile: (user) => {
        set({ user });
      },

      logout: () => {
        set({ user: null, access_token: null, isAuthenticated: false });
      },

      setAccessToken: (access_token) => {
        set({ access_token });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default userStore;
