// import React from "react";
// import { useForm } from "react-hook-form";
// import { FiCalendar } from "react-icons/fi";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import InputField from "../Inputs/InputField";
// import Button from "../Buttons/Button";
// import type { ICoupon } from "../../types/Coupon";

// interface CouponFormProps {
//   onSubmit: (data: ICoupon) => Promise<void>;
//   defaultValues?: Partial<ICoupon>;
//   isSubmitting: boolean;
//   isEditMode?: boolean;
// }

// const CouponForm: React.FC<CouponFormProps> = ({
//   onSubmit,
//   defaultValues,
//   isSubmitting,
//   isEditMode = false,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm<ICoupon>({
//     defaultValues: {
//       code: "",
//       discountType: "percent",
//       value: 0,
//       expiresAt: new Date(),
//       usageLimit: undefined,
//       isActive: true,
//       ...defaultValues,
//     },
//   });

//   const discountType = watch("discountType");
//   const isActive = watch("isActive");
//   const expiresAt = watch("expiresAt");

//   return (
//     <div className="w-full h-full overflow-y-auto bg-off-black p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold text-white">
//           {isEditMode ? "Update Coupon" : "Create New Coupon"}
//         </h2>
//         <p className="text-cold-gray mt-1">
//           {isEditMode
//             ? "Modify your coupon details"
//             : "Fill in the form to create a new discount coupon"}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Coupon Code */}
//           <InputField
//             name="code"
//             label="Coupon Code"
//             placeholder="e.g. SUMMER20"
//             register={register}
//             validation={{
//               required: "Coupon code is required",
//               minLength: {
//                 value: 3,
//                 message: "Coupon code must be at least 3 characters",
//               },
//               pattern: {
//                 value: /^[A-Z0-9_-]+$/i,
//                 message:
//                   "Only letters, numbers, hyphens and underscores allowed",
//               },
//             }}
//             error={errors.code}
//           />

//           {/* Discount Type */}
//           <div>
//             <label className="block text-sm text-cold-gray mb-2">
//               Discount Type <span className="text-red-500">*</span>
//             </label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   value="percent"
//                   checked={discountType === "percent"}
//                   onChange={() => setValue("discountType", "percent")}
//                   className="accent-primary rounded-xs w-5 h-5"
//                 />
//                 <span className="capitalize text-sm">Percentage</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   value="amount"
//                   checked={discountType === "amount"}
//                   onChange={() => setValue("discountType", "amount")}
//                   className="accent-primary rounded-xs w-5 h-5"
//                 />
//                 <span className="capitalize text-sm">Fixed Amount</span>
//               </label>
//             </div>
//           </div>

//           {/* Discount Value */}
//           <InputField
//             name="value"
//             type="number"
//             label={`Discount ${
//               discountType === "percent" ? "Percentage" : "Amount"
//             }`}
//             placeholder={discountType === "percent" ? "0-100" : "0.00"}
//             register={register}
//             validation={{
//               required: "Discount value is required",
//               min: {
//                 value: discountType === "percent" ? 1 : 0.01,
//                 message:
//                   discountType === "percent"
//                     ? "Percentage must be at least 1%"
//                     : "Amount must be greater than 0",
//               },
//               max:
//                 discountType === "percent"
//                   ? {
//                       value: 100,
//                       message: "Percentage cannot exceed 100%",
//                     }
//                   : undefined,
//             }}
//             error={errors.value}
//             addOn={discountType === "percent" ? "%" : "$"}
//           />

//           {/* Expiration Date */}
//           <div>
//             <label className="block text-sm text-cold-gray mb-2">
//               Expiration Date <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <DatePicker
//                 selected={expiresAt ? new Date(expiresAt) : null}
//                 onChange={(date: any) => setValue("expiresAt", date)}
//                 minDate={new Date()}
//                 showTimeSelect
//                 timeFormat="HH:mm"
//                 timeIntervals={15}
//                 dateFormat="MMMM d, yyyy h:mm aa"
//                 className={`w-full px-3 py-2.5 text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 duration-200 rounded-sm appearance-none ${
//                   errors.expiresAt ? "border-red-500 focus:border-red-500" : ""
//                 }`}
//                 popperPlacement="bottom-start"
//                 popperClassName="react-datepicker-popper"
//               />
//               <FiCalendar className="absolute right-3 top-3 text-cold-gray pointer-events-none" />
//             </div>
//             {errors.expiresAt && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.expiresAt.message}
//               </p>
//             )}
//           </div>

//           {/* Usage Limit */}
//           <InputField
//             name="usageLimit"
//             type="number"
//             label="Usage Limit (optional)"
//             placeholder="Leave blank for unlimited"
//             register={register}
//             validation={{
//               min: {
//                 value: 1,
//                 message: "Usage limit must be at least 1",
//               },
//             }}
//             error={errors.usageLimit}
//             optional
//           />

//           {/* Active Status */}
//           <div>
//             <label className="block text-sm text-cold-gray mb-2">Status</label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={isActive}
//                 onChange={(e) => setValue("isActive", e.target.checked)}
//                 className="accent-primary rounded-xs w-5 h-5"
//               />
//               <span className="capitalize text-sm">
//                 {isActive ? "Active" : "Inactive"}
//               </span>
//             </label>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end pt-4">
//           <Button
//             type="submit"
//             content={isEditMode ? "Update Coupon" : "Create Coupon"}
//             loading={isSubmitting}
//             styles="!min-w-[180px]"
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CouponForm;

import React from "react";
import { useForm } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputField from "../Inputs/InputField";
import Button from "../Buttons/Button";
import type { ICoupon } from "../../types/Coupon";

interface CouponFormProps {
  onSubmit: (data: ICoupon) => Promise<void>;
  defaultValues?: Partial<ICoupon>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ICoupon>({
    defaultValues: {
      code: "",
      discountType: "percent",
      value: 0,
      expiresAt: new Date(),
      usageLimit: undefined,
      isActive: true,
      ...defaultValues,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");
  const expiresAt = watch("expiresAt");

  return (
    <div className="w-full h-full overflow-y-auto bg-off-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            {isEditMode ? "Update Coupon" : "Create New Coupon"}
          </h2>
          <p className="text-cold-gray/70 mt-2">
            {isEditMode
              ? "Modify your coupon details below"
              : "Fill in the form to create a new discount coupon"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coupon Code */}
            <div className="md:col-span-2">
              <InputField
                name="code"
                label="Coupon Code"
                placeholder="e.g. SUMMER20"
                register={register}
                validation={{
                  required: "Coupon code is required",
                  minLength: {
                    value: 3,
                    message: "Coupon code must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[A-Z0-9_-]+$/i,
                    message:
                      "Only letters, numbers, hyphens and underscores allowed",
                  },
                }}
                error={errors.code}
              />
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cold-gray">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      value="percent"
                      checked={discountType === "percent"}
                      onChange={() => setValue("discountType", "percent")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-primary transition-all flex items-center justify-center group-hover:border-gray-400">
                      {discountType === "percent" && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-cold-gray/80 group-hover:text-off-white transition-colors">
                    Percentage
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="radio"
                      value="amount"
                      checked={discountType === "amount"}
                      onChange={() => setValue("discountType", "amount")}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-primary transition-all flex items-center justify-center group-hover:border-gray-400">
                      {discountType === "amount" && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-cold-gray/80 group-hover:-off-white transition-colors">
                    Fixed Amount
                  </span>
                </label>
              </div>
            </div>

            {/* Discount Value */}
            <InputField
              name="value"
              type="number"
              label={`Discount ${
                discountType === "percent" ? "Percentage" : "Amount"
              }`}
              placeholder={discountType === "percent" ? "0-100" : "0.00"}
              register={register}
              validation={{
                required: "Discount value is required",
                min: {
                  value: discountType === "percent" ? 1 : 0.01,
                  message:
                    discountType === "percent"
                      ? "Percentage must be at least 1%"
                      : "Amount must be greater than 0",
                },
                max:
                  discountType === "percent"
                    ? {
                        value: 100,
                        message: "Percentage cannot exceed 100%",
                      }
                    : undefined,
              }}
              error={errors.value}
              addOn={discountType === "percent" ? "%" : "$"}
            />

            {/* Expiration Date */}
            <div className="space-y-1">
              <label
                htmlFor="react-datepicker"
                className="block text-sm font-medium text-cold-gray"
              >
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  id="react-datepicker"
                  selected={expiresAt ? new Date(expiresAt) : null}
                  onChange={(date: Date | null) => {
                    if (date) setValue("expiresAt", date);
                  }}
                  minDate={new Date()}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className={`w-full px-4 py-2.5 text-off-white bg-transparent border border-cold-gray/70 outline-none${
                    errors.expiresAt
                      ? "!border-red-500 "
                      : "border-cold-gray/20 focus:border-cold-gray "
                  } rounded-sm shadow-sm transition-all`}
                  popperPlacement="bottom-start"
                  popperClassName="react-datepicker-dark"
                  placeholderText="Select date and time"
                  calendarClassName="border-gray-700 bg-gray-800 text-white"
                  dayClassName={(date) =>
                    `hover:bg-primary/20 ${
                      date < new Date() ? "text-cold-gray/60" : "text-off-white"
                    }`
                  }
                />
                <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cold-gray/80 pointer-events-none" />
              </div>
              {errors.expiresAt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>

            {/* Usage Limit */}
            <InputField
              name="usageLimit"
              type="number"
              label="Usage Limit"
              placeholder="Leave blank for unlimited"
              register={register}
              validation={{
                min: {
                  value: 1,
                  message: "Usage limit must be at least 1",
                },
              }}
              error={errors.usageLimit}
              optional
            />

            {/* Active Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-cold-gray">
                Status
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setValue("isActive", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-all ${
                      isActive ? "bg-primary" : "bg-cold-gray/70"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="text-cold-gray group-hover:text-white transition-colors">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              content={isEditMode ? "Update Coupon" : "Create Coupon"}
              loading={isSubmitting}
              styles="min-w-[200px] bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-primary/20 transition-all"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
