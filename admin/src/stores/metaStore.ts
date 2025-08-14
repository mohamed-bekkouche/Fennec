import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IEntity } from "../types/Entity";

interface IMetaStore {
  categories: IEntity[];
  collections: IEntity[];
  brands: IEntity[];
  setMeta: (data: {
    categories: IEntity[];
    collections: IEntity[];
    brands: IEntity[];
  }) => void;
  clearMeta: () => void;
}

const metaStore = create<IMetaStore>()(
  persist(
    (set) => ({
      categories: [],
      collections: [],
      brands: [],

      setMeta: ({ categories, collections, brands }) =>
        set({ categories, collections, brands }),

      clearMeta: () => set({ categories: [], collections: [], brands: [] }),
    }),
    {
      name: "meta-storage",
      partialize: (state) => ({
        categories: state.categories,
        collections: state.collections,
        brands: state.brands,
      }),
    }
  )
);

export default metaStore;
