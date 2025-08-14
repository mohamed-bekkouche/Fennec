import api from "../api/api";

export const getUsers = async (params: any) => {
  return await api.get("/admin/users", { params });
};

export const getUserWithOrders = async (userId: string) => {
  return await api.get("/admin/users/" + userId);
};

export const toggleBlockUser = async (userId: string) => {
  return await api.put("/admin/users/block/" + userId);
};

export const makeAdmin = async (userId: string) => {
  return await api.put("/admin/users/admin/" + userId);
};
