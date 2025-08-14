export interface IProduct {
  _id: string;
  name: string;
  description: string;
  cost: number;
  price: number;
  oldPrice?: number;
  sizes: string[] | number[] | "onsize";
  colors: string[];
  category: { _id: string; name: string };
  brand: { _id: string; name: string; image: string };
  seasonCollection: { _id: string; name: string; image: string };
  images: string[];
  stock: number;
  rating: number;
  reviews:
    | string
    | {
        user: {
          _id: string;
          username: string;
          avatar: string;
        };
        comment: string;
        rating: number;
        createdAt?: Date;
        updatedAt?: Date;
      }[];
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
