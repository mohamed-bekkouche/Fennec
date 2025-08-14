import { FaXmark } from "react-icons/fa6";
import type { IOrder } from "../../types/Order";
import Image from "../Images/Image";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../utils/formData";
import { FiPackage } from "react-icons/fi";

const OrderPreviewModal = ({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: IOrder;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-off-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-warm-gray rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-cold-gray/20">
        {/* Header */}
        <div className="p-4 border-b border-cold-gray/30 sticky top-0 bg-warm-gray/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-off-white">Order Details</h2>
            <button
              onClick={onClose}
              className="text-cold-gray/70 hover:text-off-white cursor-pointer text-xl duration-200 hover:scale-110 transition-transform"
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
              <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
                <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
                  Order Information
                </h3>
                <div className="space-y-3 text-sm text-off-white">
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Order Number:
                    </span>
                    <span className="font-mono text-sm">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Status:
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Date:
                    </span>
                    <span className="text-sm">
                      {formatDate(order?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
                <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
                  Customer Information
                </h3>
                <div className="space-y-3 text-sm">
                  {order.user ? (
                    <div className="flex items-center gap-3 pb-2 border-b border-cold-gray/10">
                      <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={order.user.avatar}
                          alt={order.user.username}
                          styles="w-full h-full object-cover"
                          fromServer={true}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-off-white">
                          {order.user.username}
                        </p>
                        {order.user?.email && (
                          <p className="text-xs text-cold-gray/70 truncate">
                            {order.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="pb-2 border-b border-cold-gray/10">
                      <p className="font-medium text-off-white">
                        {order.deliveryInfo.fullName}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Phone:
                    </span>
                    <span className="text-off-white">
                      {order.deliveryInfo.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Location:
                    </span>
                    <span className="text-off-white text-right">
                      {order.deliveryInfo.commune}, {order.deliveryInfo.wilaya}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Payment & Delivery */}
              <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
                <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
                  Payment & Delivery
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Payment Method:
                    </span>
                    <span className="capitalize text-off-white">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Delivery Method:
                    </span>
                    <span className="capitalize text-off-white">
                      {order.deliveryMethod}
                    </span>
                  </div>
                  {order.deliveryInfo.notes && (
                    <div className="pt-2">
                      <span className="text-cold-gray/80 uppercase text-xs tracking-wider block mb-1">
                        Delivery Notes:
                      </span>
                      <p className="text-sm mt-1 p-2 bg-off-black/40 rounded text-off-white/90">
                        {order.deliveryInfo.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
                <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Subtotal:
                    </span>
                    <span className="text-off-white">
                      {order.originalPrice} DA
                    </span>
                  </div>
                  {typeof order.discount === "number" &&
                    order.discount !== 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-cold-gray/10 text-green-400">
                        <span className="text-xs uppercase tracking-wider">
                          Discount:
                        </span>
                        <span>-{order.discount} DA</span>
                      </div>
                    )}

                  <div className="flex justify-between items-center py-1 border-b border-cold-gray/10">
                    <span className="text-cold-gray/80 uppercase text-xs tracking-wider">
                      Delivery Fee:
                    </span>
                    <span className="text-off-white">
                      {order.deliveryMethod === "home" ? 500 + 300 : 500} DA
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 font-semibold text-lg text-off-white">
                    <span>Total:</span>
                    <span>{order.totalPrice} DA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
              Products ({order.products?.length})
            </h3>
            <div className="space-y-3">
              {order.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-off-black/40 rounded-lg border border-cold-gray/15 hover:bg-off-black/60 transition-colors"
                >
                  {item.product ? (
                    <>
                      <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                        <Image
                          src={item.product?.images[0]}
                          alt={item.product?.name}
                          styles="w-full h-full object-cover"
                          fromServer={true}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-off-white truncate">
                          {item.product?.name}
                        </h4>
                        <div className="text-cold-gray/85 uppercase text-xs space-y-1 mt-1">
                          <div className="flex gap-3">
                            <span>
                              Color:{" "}
                              <span className="text-off-white/90 capitalize">
                                {item?.color}
                              </span>
                            </span>
                            <span>
                              Size:{" "}
                              <span className="text-off-white/90">
                                {item?.size}
                              </span>
                            </span>
                          </div>
                          <div>
                            Quantity:{" "}
                            <span className="text-off-white/90">
                              {item?.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-medium text-off-white">
                          {item.product?.price * item.quantity} DA
                        </div>
                        <div className="text-cold-gray/80 text-xs">
                          {item.product?.price} DA × {item.quantity}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-cold-gray/70 py-2">
                      <FiPackage size={40} className="mb-4 text-cold-gray/30" />
                      <p className="text-[1rem]">Product Not Found</p>
                      <p className="text-sm">This Product probably deleted</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreviewModal;
