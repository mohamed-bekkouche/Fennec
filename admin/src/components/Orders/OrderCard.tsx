import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaCogs,
  FaQuestionCircle,
  FaTimes,
  FaUndo,
} from "react-icons/fa";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formData";
import Image from "../Images/Image";
import type { IOrder, IOrderStatus } from "../../types/Order";
import { FaClock, FaTruck } from "react-icons/fa6";

interface Props {
  order: IOrder;
}
export const getOrderStatusIcon = (status: IOrderStatus) => {
  switch (status) {
    case "delivered":
      return <FaCheckCircle className="text-green-400" size={16} />;
    case "returned":
      return <FaUndo className="text-red-400" size={16} />;
    case "cancelled":
      return <FaTimes className="text-gray-400" size={16} />;
    case "pending":
      return <FaClock className="text-yellow-400" size={16} />;
    case "confirmed":
      return <FaCogs className="text-blue-400" size={16} />;
    case "shipped":
      return <FaTruck className="text-purple-400" size={16} />;
    default:
      return <FaQuestionCircle className="text-cold-gray-400" size={16} />;
  }
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "returned":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "cancelled":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "processing":
      return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
    case "shipped":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-cold-gray/10 text-cold-gray/50 border-cold-gray/20";
  }
};

const OrderCard = ({ order }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-off-black mb-2 rounded-sm">
      <div
        className="flex justify-between items-start p-3 hover:border-warm-gray/40 transition-all cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {getOrderStatusIcon(order.status)}
          <div>
            <h4 className="font-medium text-off-white text-sm mb-0.5">
              Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
            </h4>
            <p className="text-xs text-cold-gray/70 flex items-center gap-2">
              <FaCalendarAlt size={12} />
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div className="text-[1rem] font-medium text-off-white">
            {formatCurrency(order.totalPrice)}
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full border ${getOrderStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          {isOpen ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-4 pt-0"
            initial={{ scaleY: 0, originY: 0, opacity: 0 }}
            animate={{ scaleY: 1, originY: 0, opacity: 1 }}
            exit={{ scaleY: 0, originY: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 text-xs text-cold-gray/70 uppercase tracking-wide border-b border-warm-gray/20 pb-2">
                <div className="col-span-6">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {order.products.map((item) => (
                <div
                  key={item.product._id}
                  className="grid grid-cols-12 gap-3 items-center py-2 hover:bg-warm-gray/5 rounded-sm"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-sm overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fromServer={true}
                        styles="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {item.product.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-cold-gray/70 text-sm">
                    {formatCurrency(item.product.price)}
                  </div>
                  <div className="col-span-2 text-cold-gray/70 text-sm">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-white text-sm font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {order.coupon && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-sm">
                <div className="flex justify-between items-center">
                  <span className="text-green-400 text-sm font-medium">
                    Coupon Applied:
                  </span>
                  <span className="text-white font-medium">
                    {order.coupon.code} (-{order.coupon.value}
                    {order.coupon.discountType === "percent" ? "%" : " DA"})
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderCard;
