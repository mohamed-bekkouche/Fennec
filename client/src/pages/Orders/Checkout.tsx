import { useForm } from "react-hook-form";
import Image from "../../components/Image";
import InputField from "../../components/Inputs/InputField";
import OrderConfirmation from "../../components/Orders/OrderConfirmation";
import { useCart } from "../../hooks/useCart";
import { useState } from "react";
import { createOrder } from "../../services/orderService";
import toast from "react-hot-toast";
import { applyCoupon } from "../../services/couponService";
import { useNavigate } from "react-router-dom";
import ButtonColored from "../../components/Buttons/ButtonColored";
import { useTranslation } from "react-i18next";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

interface CouponData {
  _id: string;
  code: string;
  discountType: "percent" | "amount";
  value: number;
}

const Checkout = () => {
  const { formatCurrency } = useFormatCurrency();
  const { cartItems, clearCart } = useCart();
  const { t } = useTranslation(undefined, {
    keyPrefix: "orders.checkout",
  });
  const navigate = useNavigate();

  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const subTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percent"
      ? (subTotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const finalTotal = subTotal - discountAmount;

  const handleCoupon = async (data: any) => {
    try {
      const {
        data: { coupon },
      } = await applyCoupon(data.coupon);
      const { _id, code, discountType, value } = coupon;
      setAppliedCoupon({ _id, code, discountType, value });
      toast.success("Coupon applied successfully");
    } catch (error: any) {
      console.log("Error : ", error);
      toast.error("Invalid coupon");
      setOrderError(error?.response?.data?.message || "Invalid coupon");
    }
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      setOrderError(null);
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      }));

      const orderPayload = {
        ...orderData,
        products: orderItems,
        coupon: appliedCoupon?._id || null,
      };

      const {
        data: { orderId },
      } = await createOrder(orderPayload);
      toast.success("Orders Created Successfully");
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error: any) {
      console.log("Error : ", error);
      toast.error(error?.response?.data?.message || "Failed To create Order");
      setOrderError(
        error instanceof Error ? error.message : "Failed to create order"
      );
    }
  };

  return (
    <div className="w-full h-fit lg:h-dvh flex flex-col lg:flex-row items-stretch text-off-white">
      <OrderConfirmation
        onSubmit={handleOrderSubmit}
        subTotal={subTotal}
        discountAmount={discountAmount}
        finalTotal={finalTotal}
      />

      <div className="h-full flex flex-col bg-off-black lg:w-1/2 py-10 px-3 md:px-7 lg:px-10">
        <div className="flex-1 overflow-y-auto text-off-white pt-5 mb-4">
          {cartItems.map((cartItem, key) => (
            <div className="flex justify-between items-center mb-5" key={key}>
              <div className="flex w-full gap-3 md:gap-5 items-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20">
                  <Image
                    fromServer
                    styles="w-full h-full aspect-square object-cover rounded-lg"
                    src={cartItem.product.images[0]}
                    alt={cartItem.product.name}
                  />
                  <span className="absolute top-0 -end-3 -translate-y-1/2 w-6 font-semibold h-6 flex items-center justify-center rounded-full bg-cold-gray text-off-black">
                    {cartItem.quantity}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-5 flex-1">
                  <div>
                    <p className="max-md:text-sm uppercase">
                      {cartItem.product.name}
                    </p>
                    <p className="text-xs md:text-sm flex items-center gap-1 font-light text-off-white/80 ps-0.5 mt-0.5">
                      <span
                        style={{ backgroundColor: cartItem.color }}
                        className="block w-6 h-3.5 border-cold-gray/70 border rounded-xs"
                      >
                        {" "}
                      </span>{" "}
                      / {cartItem.size} / {cartItem.quantity}
                    </p>
                  </div>
                  <p className="-mt-0.5">
                    {cartItem.quantity * cartItem.product.price} DA
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(handleCoupon)}
          className="flex items-start gap-2 mb-2"
        >
          <InputField
            name="coupon"
            placeholder={t("couponPlaceholder")}
            register={register}
            validation={{
              required: true,
              minLength: {
                value: 3,
                message: t("couponInvalid"),
              },
            }}
            error={errors.coupon}
            className="bg-cold-gray placeholder:!text-off-black/70 text-off-black w-full"
          />
          <ButtonColored
            disabled={isSubmitting}
            variant="cta"
            type="submit"
            styles="py-3 px-10"
            content={t("couponCTA")}
          />
        </form>

        {orderError && (
          <div className="text-red-500 text-sm mb-2">{orderError}</div>
        )}

        <div className="flex items-center justify-between text-sm mb-2">
          <p>
            {t("items")}: {cartItems.length}
          </p>
          <p> {formatCurrency(subTotal)}</p>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-sm mb-2">
            <p>
              {" "}
              {t("discount")} ({appliedCoupon.code}):
            </p>
            <p>-{formatCurrency(discountAmount)}</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xl font-bold mb-2">
          <p>{t("total")}</p>
          <p>{formatCurrency(finalTotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
