import { FaXmark } from "react-icons/fa6";
import type { IOrder } from "../../types/Order";
import Image from "../Image";
import StatusBadge from "./StatusBadge";
import { FiPackage } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useDateFormatter } from "../../hooks/useDateFormatter";

const OrderPreviewModal = ({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder;
}) => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-off-black/20 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-cold-gray rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-warm-gray/40">
        {/* Header */}
        <div className="p-4 border-b border-warm-gray/40 sticky top-0 bg-off-white backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-off-black">
              {t("components.orders.orderDetails")}
            </h2>
            <button
              onClick={onClose}
              className="text-warm-gray/70 hover:text-off-black cursor-pointer text-xl duration-200 hover:scale-110 transition-transform"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Order Information */}
              <div className="bg-off-white p-4 rounded-lg border border-warm-gray/20">
                <h3 className="font-medium text-warm-gray/70 uppercase text-sm tracking-wider mb-3">
                  {t("components.orders.orderInformation")}
                </h3>
                <div className="space-y-3 text-sm text-off-black">
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/30">
                    <span className="text-warm-gray/80 uppercase text-xs tracking-wider">
                      {t("components.orders.orderNumber")}:
                    </span>
                    <span className="font-mono font-medium">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/30">
                    <span className="text-warm-gray/80 uppercase text-xs tracking-wider">
                      {t("components.orders.orderDate")}:
                    </span>
                    <span className="font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/30">
                    <span className="text-warm-gray/80 uppercase text-xs tracking-wider">
                      {t("components.orders.totalAmount")}:
                    </span>
                    <span className="font-bold text-green-600">
                      {order.totalPrice.toLocaleString()} DA
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-warm-gray/80 uppercase text-xs tracking-wider">
                      {t("components.orders.status")}:
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-off-white p-4 rounded-lg border border-warm-gray/20">
                <h3 className="font-medium text-warm-gray/70 uppercase text-sm tracking-wider mb-3">
                  {t("components.orders.shippingAddress")}
                </h3>
                <div className="text-sm text-off-black space-y-1">
                  <p className="font-medium">{order.deliveryInfo.fullName}</p>
                  <p>
                    {order.deliveryInfo.commune}, {order.deliveryInfo.wilaya}
                  </p>
                  <p className="text-warm-gray/70">
                    {order.deliveryInfo.phone}
                  </p>
                  {order.deliveryInfo.notes && (
                    <p className="text-warm-gray/70 italic">
                      {order.deliveryInfo.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-off-white p-4 rounded-lg border border-warm-gray/20">
              <h3 className="font-medium text-warm-gray/70 uppercase text-sm tracking-wider mb-3 flex items-center gap-2">
                <FiPackage className="w-4 h-4" />
                {t("components.orders.items")} ({order.products.length})
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {order.products.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-cold-gray/30 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-warm-gray/20">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fromServer
                        styles="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-off-black truncate">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-warm-gray/70 mt-1">
                        <span>
                          {t("components.orders.quantity")}: {item.quantity}
                        </span>
                        <span>•</span>
                        <span>
                          {t("components.orders.color")}: {item.color}
                        </span>
                        <span>•</span>
                        <span>
                          {t("components.orders.size")}: {item.size}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-off-black">
                        {(item.product.price * item.quantity).toLocaleString()}{" "}
                        DA
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-warm-gray/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray/70">
                    {t("components.orders.subtotal")}:
                  </span>
                  <span className="font-medium">
                    {order.originalPrice.toLocaleString()} DA
                  </span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>{t("product.discount")}:</span>
                    <span className="font-medium">
                      -{order.discount.toLocaleString()} DA
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray/70">
                    {t("components.orders.shipping")}:
                  </span>
                  <span className="font-medium">
                    {order.deliveryMethod === "home" ? "800" : "500"} DA
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-warm-gray/20">
                  <span>{t("components.orders.total")}:</span>
                  <span className="text-green-600">
                    {order.totalPrice.toLocaleString()} DA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewModal;
