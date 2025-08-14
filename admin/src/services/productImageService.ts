import api from "../api/api";

export const createProductImage = async (formData: FormData) => {
  return await api.post("/admin/product-image", formData);
};

export const updateProductImage = async (id: string, fromData: FormData) => {
  return await api.put("/admin/product-image/" + id, fromData);
};

export const deleteProductImages = async (id: string) => {
  return await api.delete("/admin/product-image/" + id);
};

export const getAllProductImages = async () => {
  return await api.get("/product-images");
};
