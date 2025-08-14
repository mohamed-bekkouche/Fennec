import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProduct } from "../types/Product";

export interface ICartItem {
  product: IProduct;
  color: string;
  size: string | number | "onesize";
  quantity: number;
}

interface ICartStore {
  cartItems: ICartItem[];

  addProduct: (
    product: IProduct,
    color: string,
    size: string | number | "onesize",
    quantity: number
  ) => void;

  updateProduct: (
    productId: string,
    fields: { color?: string; size?: string | number; quantity?: number }
  ) => void;

  removeProduct: (productId: string) => void;

  clearCart: () => void;
}

const cartStore = create<ICartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addProduct: (product, color, size, quantity) => {
        const current = get().cartItems;
        const existingIndex = current.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.color === color &&
            item.size === size
        );

        if (existingIndex !== -1) {
          const updated = [...current];
          updated[existingIndex].quantity += quantity;
          set({ cartItems: updated });
        } else {
          set({
            cartItems: [...current, { product, color, size, quantity }],
          });
        }
      },

      updateProduct: (productId, fields) => {
        const current = get().cartItems.map((item) =>
          item.product._id === productId ? { ...item, ...fields } : item
        );
        set({ cartItems: current });
      },

      removeProduct: (productId) => {
        const filtered = get().cartItems.filter(
          (item) => item.product._id !== productId
        );
        set({ cartItems: filtered });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "cartItems-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    }
  )
);

export default cartStore;
