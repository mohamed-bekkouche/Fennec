import api from "../api/api";

export const getFinancialAnalytics = async () => {
  return await api.get("/admin/dashboard/financial");
};

export const getSalesAnalytics = async () => {
  return await api.get("/admin/dashboard/sales");
};
