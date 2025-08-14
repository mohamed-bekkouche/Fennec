import api from "../api/api";

export const createCategory = async (data: FormData) => {
  return await api.post("/admin/categories", data);
};

export const updateCategory = async (categoryId: string, data: FormData) => {
  return await api.put("/admin/categories/" + categoryId, data);
};
export const getCategories = async (params: any) => {
  return await api.get("/admin/categories", { params });
};

export const getAllCategories = async () => {
  return await api.get("/categories");
};

export const getCategory = async (categoryId: string) => {
  return await api.get("/admin/categories/" + categoryId);
};

export const deteleCategory = async (categoryId: string) => {
  return await api.delete("/admin/categories/" + categoryId);
};
