import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CouponForm from "../../components/Coupons/CouponForm";
import { createCoupon } from "../../services/couponService";
import toast from "react-hot-toast";
import type { ICoupon } from "../../types/Coupon";

const NewCoupon: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: ICoupon) => {
    try {
      setIsSubmitting(true);
      await createCoupon({
        ...data,
        expiresAt: data.expiresAt,
        usageLimit: data.usageLimit || undefined,
      });
      toast.success("Coupon created successfully");
      navigate("/coupons");
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CouponForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isEditMode={false}
    />
  );
};

export default NewCoupon;
