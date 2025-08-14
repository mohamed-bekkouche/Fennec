export interface IHotspot {
  positionX: number;
  positionY: number;
  product: string;
  _id?: string;
}

export interface IProductImage {
  _id: string;
  image: string;
  hotspots: IHotspot[];
  createdAt?: string;
  updatedAt?: string;
}

export type HotspotFormValues = {
  image: File | null;
  hotspots: IHotspot[];
};
