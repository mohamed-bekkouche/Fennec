export interface ICoupon {
  _id: string;
  code: string;
  discountType: "percent" | "amount";
  value: number;
  expiresAt: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
}
