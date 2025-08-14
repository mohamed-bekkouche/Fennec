import { useState } from "react";

import Image from "../Images/Image";
import type { IOrder, IOrderStatus } from "../../types/Order";
import { FaChevronDown, FaChevronUp, FaEye } from "react-icons/fa6";
import { FiEdit3, FiPackage } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import StatusUpdateModal from "./StatusUpdateModal";
import OrderPreviewModal from "./OrderPreviewModal";
import { updateOrderStatus } from "../../services/ordersService";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formData";

const OrderItem = ({
  order,
  onStatusUpdated,
}: {
  order: IOrder;
  onStatusUpdated: (orderId: string, status: IOrderStatus) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleUpdateStatus = async (
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "returned"
      | "cancelled",
    reason?: string
  ) => {
    try {
      await updateOrderStatus(order._id, { status, reason });
      toast.success(
        `Status updated to: ${status}${reason ? ` (Reason: ${reason})` : ""}`
      );
      onStatusUpdated(order._id, status);
      setShowStatusModal(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update order status"
      );
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <div className="bg-warm-gray text-sm p-2 mb-2 overflow-hidden duration-200 h-fit">
        {/* Main order row */}

        <div className="grid grid-cols-9 gap-4 items-center justify-between">
          {/* Order number */}
          <div className="col-span-2 flex items-center gap-2">
            <FiPackage className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-sm font-medium">
              {order.orderNumber}
            </span>
          </div>

          {/* Customer info */}
          <div className=" col-span-2 flex items-center gap-2">
            {order.user ? (
              <>
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={order.user.avatar}
                    alt={order.user.username}
                    fromServer={!order.user.avatar.includes("https")}
                    styles="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[1rem] font-medium capitalize">
                  {order.user.username}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-gray-500" />
                <span className="text-[1rem] capitalize">
                  {order.deliveryInfo.fullName}
                </span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="col-span-1">{order.deliveryInfo.phone}</div>

          {/* {Status} */}
          <div className="col-span-1">
            <StatusBadge status={order.status} />
          </div>

          {/* Price */}
          <div className=" col-span-1">
            <div className="font-semibold">{order.totalPrice} DA</div>
          </div>

          <div className="col-span-1 pl-2">{formatDate(order.createdAt)}</div>

          {/* Actions */}
          <div className="col-span-1 flex items-center justify-end gap-2 ">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="p-2 cursor-pointer text-cold-gray/80 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Details"
            >
              <FaEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowStatusModal(true)}
              className="p-2 cursor-pointer text-cold-gray/80 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Update Status"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 cursor-pointer text-cold-gray/80 hover:text-off-black hover:bg-off-white/95 rounded-md transition-colors"
            >
              {isExpanded ? (
                <FaChevronUp className="w-4 h-4" />
              ) : (
                <FaChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={{
                initial: { height: 0 },
                animate: { height: "265px" },
              }}
              initial="initial"
              animate={isExpanded ? "animate" : "initial"}
              exit="initial"
              transition={{ duration: 0.2, ease: "easeIn" }}
              className="p-4 bg-off-black rounded-lg mt-2 overflow-hidden"
            >
              {/* Header */}
              <div className="grid grid-cols-9 gap-4 text-cold-gray/70 text-xs font-medium uppercase tracking-wider mb-3 px-2">
                <div className="col-span-1">Wilaya</div>
                <div className="col-span-1">Commune</div>
                <div className="col-span-1">Phone</div>
                <div className="col-span-1">Payment</div>
                <div className="col-span-1">Delivery</div>
                <div className="col-span-1">Coupon</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1">Discount</div>
                <div className="col-span-1 text-center">Items</div>
              </div>

              {/* Data Row */}
              <div className="grid grid-cols-9 gap-4 bg-warm-gray p-3 rounded-md border border-cold-gray/20">
                <div className="col-span-1 font-medium">
                  {order.deliveryInfo.wilaya}
                </div>
                <div className="col-span-1">{order.deliveryInfo.commune}</div>
                <div className="col-span-1 text-primary">
                  {order.deliveryInfo.phone}
                </div>
                <div className="col-span-1">
                  <span
                    className={`px-2 py-1 capitalize rounded-full ${
                      order.paymentMethod === "cash"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="col-span-1 capitalize">
                  {order.deliveryMethod}
                </div>
                <div className="col-span-1">
                  {order.coupon?.code ? (
                    <span className="bg-purple-50 text-purple-600 font-medium text-sm uppercase px-2 py-1 rounded-full">
                      {order.coupon?.code}
                    </span>
                  ) : (
                    <span className="text-cold-gray/80">No Promo</span>
                  )}
                </div>
                <div className="col-span-1 font-medium text-green-400">
                  {order.originalPrice} DA
                </div>
                <div className="col-span-1">
                  {order.discount ? (
                    <span className="text-red-500 font-medium">
                      -{order.discount} DA
                    </span>
                  ) : (
                    <span className="text-cold-gray/80">None</span>
                  )}
                </div>
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 text-[1rem] bg-primary rounded-full font-medium">
                    {order.products?.length}
                  </span>
                </div>
              </div>

              {/* Products Preview (optional) */}
              {order.products?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-cold-gray/20">
                  <h4 className="text-sm font-medium text-cold-gray/70 uppercase mb-2">
                    Products:
                  </h4>
                  <div className="space-y-2">
                    {order.products.slice(0, 3).map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-off-white"
                      >
                        <span className="w-5">{index + 1}.</span>
                        <span className="truncate flex-1">
                          {product.product.name}
                        </span>
                        <span className="ml-2 font-medium">
                          {product.quantity}x
                        </span>
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div className="text-xs text-cold-gray/80">
                        +{order.products.length - 3} more items...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status update modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentStatus={order.status}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Order preview modal */}
      <OrderPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        order={order}
      />
    </>
  );
};

export default OrderItem;
