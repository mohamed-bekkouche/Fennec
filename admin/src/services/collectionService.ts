import api from "../api/api";

export const createCollection = async (data: FormData) => {
  return await api.post("/admin/collections", data);
};

export const updateCollection = async (
  collectionId: string,
  data: FormData
) => {
  return await api.put("/admin/collections/" + collectionId, data);
};
export const getCollections = async (params: any) => {
  return await api.get("/admin/collections", { params });
};

export const getAllCollections = async () => {
  return await api.get("/collections");
};

export const getCollection = async (collectionId: string) => {
  return await api.get("/admin/collections/" + collectionId);
};

export const deleteCollection = async (collectionId: string) => {
  return await api.delete("/admin/collections/" + collectionId);
};
