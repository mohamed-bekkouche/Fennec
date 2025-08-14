import api from "../api/api";
import type { IOrderStatus } from "../types/Order";

export const getOrders = async (params: any) => {
  return await api.get("/admin/orders", {
    params,
  });
};

export const updateOrderStatus = async (
  orderId: string,
  data: {
    status: IOrderStatus;
    reason?: string;
  }
) => {
  return await api.put("/admin/orders/" + orderId, data);
};
