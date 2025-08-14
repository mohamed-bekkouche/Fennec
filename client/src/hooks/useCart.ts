import cartStore from "../stores/cartStore";
import type { IProduct } from "../types/Product";

export const useCart = () => cartStore();

export const addProduct = (
  product: IProduct,
  color: string,
  size: string | number | "onesize",
  quantity: number
) => {
  return cartStore.getState().addProduct(product, color, size, quantity);
};

export const updateProduct = (
  productId: string,
  fields: { color?: string; size?: string | number; quantity?: number }
) => {
  return cartStore.getState().updateProduct(productId, fields);
};

export const removeProduct = (productId: string) => {
  return cartStore.getState().removeProduct(productId);
};
