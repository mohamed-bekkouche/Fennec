import adminStore, { type IAdmin } from "../stores/adminStore";

export const useAuth = () => adminStore();

export const getAccessToken = () => {
  return adminStore.getState().access_token;
};

export const setAccessToken = (access_token: string) => {
  adminStore.getState().setAccessToken(access_token);
};

export const setProfile = (user: IAdmin) => {
  adminStore.getState().setProfile(user);
};

export const login = (user: IAdmin, access_token: string) => {
  adminStore.getState().login(user, access_token);
};

export const logout = () => {
  adminStore.getState().logout();
};
