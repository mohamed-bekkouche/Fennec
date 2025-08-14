export type IOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export interface IOrder {
  _id: string;
  orderNumber: string;

  user: {
    _id: string;
    username: string;
    avatar: string;
    email: string;
  } | null;

  status: IOrderStatus;

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

  coupon: {
    _id: string;
    code: string;
    discountType: "percent" | "amount";
    value: number;
    expiresAt: Date;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
  } | null;

  discount?: number;

  paymentMethod: "cash";

  deliveryMethod: "home" | "pickup";

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
