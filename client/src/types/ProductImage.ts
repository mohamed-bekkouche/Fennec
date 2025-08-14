import type { IProduct } from "./Product";

export interface IHotspot {
  positionX: number;
  positionY: number;
  product: IProduct;
}

export interface IProductImage {
  _id: string;
  image: string;
  hotspots: IHotspot[];
}
