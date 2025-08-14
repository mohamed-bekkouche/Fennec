import api from "../api/api";

export const getSuitElements = async (params?: any) => {
  return await api.get("/suit-elements", { params });
};

export const createSuitElement = async (data: FormData) => {
  return await api.post("/admin/suit-elements", data);
};

export const deleteSuitElement = async (getSuitElementId: string) => {
  return await api.delete("/admin/suit-elements/" + getSuitElementId);
};
