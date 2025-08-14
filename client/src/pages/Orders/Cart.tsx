import { useState } from "react";
import SectionHeader from "../../components/SectionHeader";
import { useCart } from "../../hooks/useCart";
import CartCard from "../../components/Orders/CartCard";
import {
  FaCartPlus,
  FaCottonBureau,
  FaCreditCard,
  FaMoneyBill,
  FaTrash,
  FaTruck,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import ButtonColored from "../../components/Buttons/ButtonColored";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const Cart = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "orders.cart" });
  const { formatCurrency } = useFormatCurrency();
  const { cartItems, clearCart } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-cold-gray">
      <div className="max-w-[1800px] mx-auto p-5 md:px-10 min-h-[calc(100dvh-273px)]">
        <SectionHeader
          title={t("title")}
          subTitle={`${cartItems.length} ${t("title")}`}
        />

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t("empty")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 py-4 px-6 bg-off-black font-medium text-off-white text-sm uppercase tracking-wide mb-4">
                <div className="col-span-4">{t("product")}</div>
                <div className="col-span-2 text-center">{t("color")}</div>
                <div className="col-span-3 text-center">{t("size")}</div>
                <div className="col-span-1 text-center">{t("quantity")}</div>
                <div className="col-span-2 text-end">{t("total")}</div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-4">
                {cartItems.map((cartIemt) => (
                  <CartCard key={cartIemt.product._id} cartIemt={cartIemt} />
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <>
              <div className="flex items-center gap-2 font-medium text-sm uppercase text-off-white bg-off-black px-6 py-4 mb-4">
                <FaCartPlus size={20} />
                {t("summaryTitle")}
              </div>

              <div className="px-6 py-4 bg-off-white shadow-sm hover:shadow-md  duration-200">
                {/* Total Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-off-black">
                      {t("total")}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex max-sm:flex-col flex-wrap gap-3 pt-4 justify-end">
                  <ButtonColored
                    variant="delete"
                    action={() => setShowClearConfirm(true)}
                    styles="max-lg:!flex-1 lg:!w-72"
                    content={
                      <>
                        <FaTrash size={18} />
                        {t("clearCart")}
                      </>
                    }
                  />
                  <ButtonColored
                    variant="cta"
                    styles="max-lg:!flex-1 !px-0 !py-0 lg:!w-72"
                    content={
                      <Link
                        to="/checkout"
                        className="flex w-full py-2.5 items-center gap-3 justify-center"
                      >
                        <FaCreditCard size={18} />
                        {t("checkout")}
                      </Link>
                    }
                  />
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                    <FaMoneyBill size={16} className="text-green-500" />
                    <span> {t("handPayment")} </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                    <FaTruck size={16} className="text-blue-500" />
                    <span> {t("fastDelivery")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                    <FaCottonBureau size={16} className="text-blue-500" />
                    <span> {t("premuimFabrics")}</span>
                  </div>
                </div>
              </div>
            </>

            <ConfirmationModal
              type="delete"
              isOpen={showClearConfirm}
              onClose={() => setShowClearConfirm(false)}
              onConfirm={handleClearCart}
              title={t("confirmationModalTitle")}
              message={t("confirmationModalMessage")}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
