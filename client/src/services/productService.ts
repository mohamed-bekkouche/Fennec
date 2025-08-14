import api from "../api/api";

export const getProducts = async (params?: any) => {
  return await api.get("/products", { params });
};

export const getTopSellingProducts = async (params?: any) => {
  return await api.get("/products/top-selling", { params });
};

export const getProduct = async (productId: string) => {
  return await api.get("/products/" + productId);
};

export const getUserWishlist = async (params?: any) => {
  return await api.get("/products/wishlist", { params });
};

export const addToWishlist = async (productId: string) => {
  return await api.put("/products/wishlist/" + productId);
};

export const removeFromWishlist = async (productId: string) => {
  return await api.delete("/products/wishlist/" + productId);
};
