import { useForm } from "react-hook-form";
import InputField from "../../components/Inputs/InputField";
import Button from "../../components/Buttons/Button";
import { FaPlus } from "react-icons/fa6";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { getCoupons } from "../../services/couponService";
import type { ICoupon } from "../../types/Coupon";
import { Link } from "react-router-dom";
import { CouponItem } from "../../components/Coupons/CouponItem";

const Coupons = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const { register, watch } = useForm<{
    code: string | null;
    sortBy:
      | "createdAt"
      | "code"
      | "value"
      | "usageLimit"
      | "usedCount"
      | "expiresAt";
    order: "asc" | "desc";
    isActive: boolean | null;
    isExpired: boolean | null;
  }>({
    defaultValues: {
      code: null,
      sortBy: "createdAt",
      order: "asc",

      isActive: null,
      isExpired: null,
    },
  });

  const { isActive, isExpired, code, sortBy, order } = watch();

  const fetchCoupons = async (params = {}) => {
    try {
      const { data } = await getCoupons(params);
      setCoupons(data.coupons);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCoupons({
      isActive,
      isExpired,
      code,
      sortBy,
      order,
      page: currentPage,
      limit,
    });
  }, [isActive, isExpired, code, sortBy, order, currentPage, limit]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="bg-off-black p-3 rounded-sm flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <InputField
            name="code"
            placeholder="Search For Coupon..."
            type="search"
            register={register}
            className="focus:!translate-y-0 !py-2 !mb-0"
          />

          <select
            id="isExpired"
            {...register("isExpired")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">All Coupons</option>
            <option value="true">Expired</option>
            <option value="false">Not expired</option>
          </select>

          <select
            id="isActive"
            {...register("isActive")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">All Coupons</option>
            <option value="true">Active</option>
            <option value="false">Not Active</option>
          </select>

          <select
            {...register("sortBy")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            | "createdAt" | "code" | "value" | "usageLimit" | "usedCount" |
            "expiresAt";
            <option value="createdAt">Sort by created At</option>
            <option value="code">Sort by code</option>
            <option value="value">Sort by value</option>
            <option value="usageLimit">Sort by usage limit</option>
            <option value="usedCount">Sort by used count</option>
            <option value="expiresAt">Sort by expires At</option>
          </select>

          <select
            {...register("order")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="asc"> Ascending </option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <Button
          content={
            <Link to="new-coupon" className="flex gap-2 items-center">
              <FaPlus className="text-lg" />
              New Coupon
            </Link>
          }
          styles="rounded-sm w-fit"
        />
      </div>

      <div className="flex-1 h-full w-full bg-off-black overflow-hidden p-2 pb-0 rounded-sm flex flex-col">
        <div className="grid lg:grid-cols-12 gap-4 text-cold-gray/70 text-xs uppercase tracking-wide mb-3">
          <div className="col-span-2">Code</div>
          <div className="col-span-1">Value</div>
          <div className="col-span-1 text-center">Limit</div>
          <div className="col-span-1">Used</div>
          <div className="col-span-2 text-center">is Active</div>
          <div className="col-span-2 text-center">Expired At</div>
          <div className="col-span-2 text-center">Created At</div>
          <div className="col-span-1 text-end pe-2">Actions</div>
        </div>

        <div className="w-full flex-1 overflow-scroll">
          {coupons.map((coupon) => (
            <CouponItem key={coupon._id} coupon={coupon} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Coupons;
