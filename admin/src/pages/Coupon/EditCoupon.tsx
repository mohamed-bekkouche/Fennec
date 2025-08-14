import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CouponForm from "../../components/Coupons/CouponForm";
import { getCoupon, updateCoupon } from "../../services/couponService";
import toast from "react-hot-toast";
import type { ICoupon } from "../../types/Coupon";

const EditCoupon: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupon, setCoupon] = useState<ICoupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data } = await getCoupon(id!);
        setCoupon(data.coupon);
      } catch (error) {
        toast.error("Failed to load coupon");
        navigate("/coupons");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupon();
  }, [id, navigate]);

  const handleSubmit = async (data: ICoupon) => {
    try {
      setIsSubmitting(true);
      await updateCoupon(id!, {
        ...data,
        expiresAt: data.expiresAt,
        usageLimit: data.usageLimit || undefined,
      });
      toast.success("Coupon updated successfully");
      navigate("/coupons");
    } catch (error: any) {
      console.error("Error updating coupon:", error);
      toast.error(error?.response?.data?.message || "Failed to update coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  if (!coupon) {
    return <div className="p-6 text-white">Coupon not found</div>;
  }

  return (
    <CouponForm
      onSubmit={handleSubmit}
      defaultValues={coupon}
      isSubmitting={isSubmitting}
      isEditMode={true}
    />
  );
};

export default EditCoupon;
