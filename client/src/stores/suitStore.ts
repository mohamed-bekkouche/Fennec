import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProduct } from "../types/Product";

export interface ISuitElement {
  _id: string;
  product: IProduct;
  type:
    | "jacket"
    | "pants"
    | "shirt"
    | "tie"
    | "shoes"
    | "vest"
    | "belt"
    | "accessory";
  color: {
    name: string;
    image: string;
  };
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type SuitElementTypes = ISuitElement["type"];

type SuitState = {
  [key in SuitElementTypes]: ISuitElement | null;
};

interface ISuitStore extends SuitState {
  removeElement: (type: SuitElementTypes) => void;
  clearSuit: () => void;
  setSuit: (elements: Partial<SuitState>) => void;
  getSuitSummary: () => { elements: ISuitElement[]; totalPrice: number };
}

const initialState: SuitState = {
  jacket: null,
  pants: null,
  shirt: null,
  tie: null,
  shoes: null,
  vest: null,
  belt: null,
  accessory: null,
};

const suitStore = create<ISuitStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      removeElement: (type) => {
        set({ [type]: null });
      },

      clearSuit: () => {
        set({ ...initialState });
      },

      setSuit: (elements) => {
        set((state) => ({ ...state, ...elements }));
      },
      getSuitSummary: () => {
        const state = get();
        const selectedProducts = Object.values(state).filter(
          (item) => item && typeof item === "object" && "product" in item
        ) as ISuitElement[];

        const totalPrice = selectedProducts.reduce(
          (sum, item) => sum + item.product.price,
          0
        );

        return {
          elements: selectedProducts,
          totalPrice,
        };
      },
    }),
    {
      name: "suit-storage",
      partialize: (state) => {
        const { jacket, pants, shirt, tie, shoes, vest, belt, accessory } =
          state;
        return {
          jacket,
          pants,
          shirt,
          tie,
          shoes,
          vest,
          belt,
          accessory,
        };
      },
    }
  )
);

export default suitStore;
