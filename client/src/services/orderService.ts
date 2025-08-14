import api from "../api/api";

export const createOrder = async (data: any) => {
  return await api.post("/orders", data);
};

export const getOrders = async (params?: any) => {
  return await api.get("/orders", { params });
};
export const getOrder = async (orderId: string) => {
  return await api.get("/orders/" + orderId);
};
