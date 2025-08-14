export type orderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export interface IOrder extends Document {
  _id?: string;
  user: { username: string; avatar: string; _id: string; email: string } | null;
  orderNumber: string;

  products: {
    product: {
      _id: string;
      name: string;
      images: string[];
      price: number;
    };
    color: string;
    size: string | number | "onesize";
    quantity: number;
  }[];

  originalPrice: number;
  totalPrice: number;
  coupon: null;
  discount?: number;

  paymentMethod: "cash";

  deliveryMethod: "home" | "pickup";

  status: orderStatus;

  deliveryInfo: {
    fullName: string;
    phone: string;
    wilaya: string;
    commune: string;
    notes?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
