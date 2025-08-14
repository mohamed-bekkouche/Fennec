import api from "../api/api";

export const createCoupon = async (data: any) => {
  return await api.post("/admin/coupons", data);
};

export const updateCoupon = async (couponId: string, data: any) => {
  return await api.put("/admin/coupons/" + couponId, data);
};

export const getCoupon = async (couponId: string) => {
  return await api.get("/admin/coupons/" + couponId);
};

export const getCoupons = async (params: any) => {
  return await api.get("/admin/coupons", { params });
};
