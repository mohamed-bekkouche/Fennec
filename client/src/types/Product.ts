export interface IProduct {
  _id: string;
  name: string;
  description: string;
  cost: number;
  price: number;
  oldPrice?: number;
  sizes: string[] | number[] | "onsize";
  colors: string[];
  category: string | { _id: string; name: string };
  brand: string | { _id: string; name: string; image: string };
  seasonCollection: string | { _id: string; name: string; image: string };
  images: string[];
  stock: number;
  rating: number;
  reviews: {
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
