import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IAdmin {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin: true;
  googleAccount: boolean;
  wishList?: string[];
}

interface IAdminStore {
  admin: IAdmin | null;
  access_token: string | null;
  isAuthenticated: boolean;
  login: (admin: IAdmin, access_token: string) => void;
  setProfile: (admin: IAdmin) => void;
  logout: () => void;
  setAccessToken: (access_token: string) => void;
}

const adminStore = create<IAdminStore>()(
  persist(
    (set) => ({
      admin: null,
      access_token: null,
      isAuthenticated: false,

      login: (admin, access_token) => {
        set({ admin, access_token, isAuthenticated: true });
      },

      setProfile: (admin) => {
        set({ admin });
      },

      logout: () => {
        set({ admin: null, access_token: null, isAuthenticated: false });
      },

      setAccessToken: (access_token) => {
        set({ access_token });
      },
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({
        admin: state.admin,
        access_token: state.access_token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default adminStore;
