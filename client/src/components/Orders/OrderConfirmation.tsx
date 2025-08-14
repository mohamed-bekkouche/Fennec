import { FaCreditCard, FaTruck, FaUser } from "react-icons/fa6";
import { FiHome, FiPackage } from "react-icons/fi";
import InputField from "../Inputs/InputField";
import { useCart } from "../../hooks/useCart";
import { FormProvider, useForm } from "react-hook-form";
import ButtonColored from "../Buttons/ButtonColored";

interface DeliveryInfo {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  notes: string;
}

interface OrderFormData {
  deliveryInfo: DeliveryInfo;
  deliveryMethod: "home" | "pickup";
}

interface OrderConfirmationProps {
  onSubmit: (data: OrderFormData) => void;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
}

const wilayas: string[] = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "MSila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arreridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
];

import { useTranslation } from "react-i18next";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const OrderConfirmation = ({
  onSubmit,
  subTotal,
  discountAmount,
  finalTotal,
}: OrderConfirmationProps) => {
  const { cartItems } = useCart();
  const { t } = useTranslation(undefined, {
    keyPrefix: "orders.orderConfirmation",
  });
  const { formatCurrency } = useFormatCurrency();

  const methods = useForm<OrderFormData>({
    mode: "onBlur",
    defaultValues: {
      deliveryInfo: {
        fullName: "",
        phone: "",
        wilaya: "",
        commune: "",
        notes: "",
      },
      deliveryMethod: "home",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;
  const deliveryMethod = watch("deliveryMethod");

  const getShippingCost = (): number => (deliveryMethod === "home" ? 200 : 0);

  return (
    <div className="flex-1 bg-off-white py-10 px-5 h-fit lg:min-h-screen">
      <div className="rounded-2xl w-full sm:max-w-4/5 mx-auto lg:max-w-xl flex flex-col">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto flex-1"
          >
            {/* Delivery Information */}
            <div className="mb-5">
              <h3 className="mb-1 font-semibold flex items-center gap-2 text-off-black">
                <FaUser className="text-lg" />
                {t("deliveryInfo.title")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 text-off-black">
                <InputField
                  name="deliveryInfo.fullName"
                  label={t("deliveryInfo.fullName")}
                  placeholder={t("deliveryInfo.fullNamePlaceholder")}
                  register={register}
                  error={errors.deliveryInfo?.fullName}
                  validation={{
                    required: t("deliveryInfo.fullNameRequired"),
                    minLength: {
                      value: 2,
                      message: t("deliveryInfo.fullNameMinLength"),
                    },
                  }}
                />

                <InputField
                  name="deliveryInfo.phone"
                  type="tel"
                  label={t("deliveryInfo.phone")}
                  placeholder={t("deliveryInfo.phonePlaceholder")}
                  register={register}
                  error={errors.deliveryInfo?.phone}
                  validation={{
                    required: t("deliveryInfo.phoneRequired"),
                    pattern: {
                      value: /^0[567]\d{8}$/,
                      message: t("deliveryInfo.phonePattern"),
                    },
                  }}
                />

                <div className="mb-2">
                  <label
                    className="capitalize font-medium text-sm"
                    htmlFor="deliveryInfo.wilaya"
                  >
                    {t("deliveryInfo.wilaya")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="deliveryInfo.wilaya"
                    {...register("deliveryInfo.wilaya", {
                      required: t("deliveryInfo.wilayaRequired"),
                    })}
                    className={`w-full border px-3 py-2.5 rounded-sm outline-none ${
                      errors.deliveryInfo?.wilaya
                        ? "border-red-500 focus:border-red-500"
                        : "border-warm-gray/40 focus:border-warm-gray"
                    }`}
                  >
                    <option value="">{t("deliveryInfo.selectWilaya")}</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                  {errors.deliveryInfo?.wilaya && (
                    <p className="text-red-500 text-sm">
                      {errors.deliveryInfo.wilaya.message}
                    </p>
                  )}
                </div>

                <InputField
                  name="deliveryInfo.commune"
                  label={t("deliveryInfo.commune")}
                  placeholder={t("deliveryInfo.communePlaceholder")}
                  register={register}
                  error={errors.deliveryInfo?.commune}
                  validation={{
                    required: t("deliveryInfo.communeRequired"),
                    minLength: {
                      value: 2,
                      message: t("deliveryInfo.communeMinLength"),
                    },
                  }}
                />
              </div>

              <div>
                <label
                  className="capitalize font-medium text-off-black text-sm"
                  htmlFor="deliveryInfo.notes"
                >
                  {t("deliveryInfo.notes")}{" "}
                  <span>{t("deliveryInfo.optional")}</span>
                </label>
                <textarea
                  id="deliveryInfo.notes"
                  {...register("deliveryInfo.notes")}
                  rows={3}
                  className="w-full border text-off-black resize-none border-warm-gray/40 focus:border-warm-gray px-3 py-2.5 rounded-sm placeholder:text-warm-gray/40 outline-none"
                  placeholder={t("deliveryInfo.notesPlaceholder")}
                />
              </div>
            </div>

            {/* Delivery Method */}
            <div className="mb-5">
              <h3 className="mb-1 text-off-black font-semibold flex items-center gap-2">
                <FaTruck className="text-lg" />
                {t("deliveryMethod.title")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <label
                  className={`border-2 rounded-sm p-4 cursor-pointer transition-all ${
                    deliveryMethod === "home"
                      ? "border-green-600 bg-green-100"
                      : "border-warm-gray/30 hover:border-green-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="home"
                    {...register("deliveryMethod")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 text-off-black">
                    <FiHome className="text-xl" />
                    <div>
                      <p className="font-medium">
                        {t("deliveryMethod.home.label")}
                      </p>
                      <p className="text-sm text-warm-gray/70">
                        {t("deliveryMethod.home.description")}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {t("deliveryMethod.home.cost", {
                          cost: formatCurrency(200),
                        })}
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`border-2 rounded-sm p-4 cursor-pointer transition-all ${
                    deliveryMethod === "pickup"
                      ? "border-green-600 bg-green-100"
                      : "border-warm-gray/30 hover:border-green-600"
                  }`}
                >
                  <input
                    type="radio"
                    value="pickup"
                    {...register("deliveryMethod")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 text-off-black">
                    <FiPackage className="text-xl" />
                    <div>
                      <p className="font-medium">
                        {t("deliveryMethod.pickup.label")}
                      </p>
                      <p className="text-sm text-warm-gray/70">
                        {t("deliveryMethod.pickup.description")}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        {t("deliveryMethod.pickup.cost")}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-off-black flex items-center gap-2">
                <FaCreditCard className="text-lg" />
                {t("orderSummary.title")}
              </h3>

              <div className="mb-3">
                <div className="flex justify-between text-warm-gray/80">
                  <span>
                    {t("orderSummary.subtotal", { count: cartItems.length })}
                  </span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-warm-gray/80">
                    <span>{t("orderSummary.discount")}</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-warm-gray/80 mb-2">
                  <span>{t("orderSummary.shipping")}</span>
                  <span>{formatCurrency(getShippingCost())}</span>
                </div>
                <div className="border-t text-off-black border-warm-gray/20 pt-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>{t("orderSummary.total")}</span>
                    <span className="text-green-600">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <ButtonColored
              variant="success"
              type="submit"
              disabled={isSubmitting}
              styles="py-3 w-full"
              content={
                <>
                  <FiPackage size={20} />
                  {t("confirmButton")}
                </>
              }
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default OrderConfirmation;
