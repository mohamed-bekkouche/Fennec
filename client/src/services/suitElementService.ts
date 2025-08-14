import api from "../api/api";

export const getSuitElements = async (params?: any) => {
  return await api.get("/suit-elements", {
    params,
  });
};
