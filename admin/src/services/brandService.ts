import api from "../api/api";

export const createBrand = async (data: FormData) => {
  return await api.post("/admin/brands", data);
};

export const updateBrand = async (brandId: string, data: FormData) => {
  return await api.put("/admin/brands/" + brandId, data);
};

export const getBrands = async (params: any) => {
  return await api.get("/admin/brands", { params });
};

export const getAllBrands = async () => {
  return await api.get("/brands");
};

export const getBrand = async (brandId: string) => {
  return await api.get("/admin/brands/" + brandId);
};

export const deleteBrand = async (brandId: string) => {
  return await api.delete("/admin/brands/" + brandId);
};
