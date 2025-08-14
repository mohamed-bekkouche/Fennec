import api from "../api/api";

export const loginAdmin = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const googleLogin = async (data: { credential: any }) => {
  return await api.post("/auth/google-login", data);
};

export const logOutAdmin = async () => {
  return await api.post("/auth/logout");
};

export const updateProfile = async (data: FormData) => {
  return await api.put("/auth/profile", data);
};
