import api from "../api/api";

export const createProduct = async (data: FormData) => {
  return await api.post("/admin/products", data);
};

export const updateProduct = async (productId: string, data: FormData) => {
  return await api.put("/admin/products/" + productId, data);
};
export const deleteProduct = async (productId: string) => {
  return await api.delete("/admin/products/" + productId);
};

export const getProducts = async (params?: any) => {
  return await api.get("/products", {
    params,
  });
};

export const getProductById = async (productId: string) => {
  return await api.get("/products/" + productId);
};
