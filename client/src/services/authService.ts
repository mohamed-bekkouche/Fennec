import api from "../api/api";

export const loginUser = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return await api.post("/auth/register", data);
};

export const activateUser = async (data: {
  activation_number: string;
  activation_token?: string;
}) => {
  return await api.post("/auth/activate", data);
};

export const googleLogin = async (data: { credential: any }) => {
  return await api.post("/auth/google-login", data);
};

export const logOutUser = async () => {
  return await api.post("/auth/logout");
};

export const updateProfile = async (data: FormData) => {
  return await api.put("/auth/profile", data);
};

export const confirmEmail = async (data: {
  activation_number: string;
  email_token?: string;
}) => {
  return await api.put("/auth/confirm-email", data);
};

export const passwordRecovery = async (data: { email: string }) => {
  return await api.post("/auth/recovery", data);
};

export const resetPassword = async (data: {
  newPassword: string;
  recovery_token: string;
}) => {
  return await api.post("/auth/reset", data);
};
