import api from "../api/api";

export const getAllCategories = async () => {
  return await api.get("/categories");
};

export const getAllBrands = async () => {
  return await api.get("/brands");
};

export const getAllCollections = async () => {
  return await api.get("/collections");
};
