import { FaPen } from "react-icons/fa6";
import type { ICoupon } from "../../types/Coupon";
import Button from "../Buttons/Button";
import { Link } from "react-router-dom";
import { RiCoupon2Line } from "react-icons/ri";
import { formatDate } from "../../utils/formData";

export const CouponItem = ({ coupon }: { coupon: ICoupon }) => {
  return (
    <div className="grid bg-warm-gray lg:grid-cols-12 items-center gap-4 text-off-white text-sm p-2 pr-0 mb-2 tracking-wide">
      <div className="col-span-2 flex gap-3 items-center">
        <div className="flex items-center gap-1.5">
          <RiCoupon2Line className="text-xl" />
          <p className="text-sm font-medium"> {coupon.code} </p>
        </div>
      </div>
      <div className="col-span-1">
        {coupon.discountType === "amount"
          ? `${coupon.value} DA`
          : `${coupon.value}%`}
      </div>
      <div className="col-span-1 text-center">
        {coupon.usageLimit || "Unlimited"}
      </div>
      <div className="col-span-1"> {coupon.usedCount} </div>
      <div className="col-span-2 justify-center flex items-center gap-1">
        <span
          className={`px-3 py-1.5 rounded-full text-sm ${
            coupon.isActive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {" "}
          {coupon.isActive ? "Active" : "Not active"}{" "}
        </span>
      </div>
      <div className="col-span-2 text-center text-red-500">
        {formatDate(coupon?.expiresAt)}
      </div>
      <div className="col-span-2 text-center">
        {formatDate(coupon?.createdAt)}
      </div>
      <div className="col-span-1 flex justify-end">
        <Button
          styles="!px-0 !py-0 !capitalize"
          content={
            <Link
              to={`edit-coupon/${coupon._id}`}
              className="flex gap-2 items-center !px-3 !py-2"
            >
              <FaPen />
              Edit
            </Link>
          }
        />
      </div>
    </div>
  );
};
