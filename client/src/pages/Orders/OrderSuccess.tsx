import { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCalendar,
  FaCheck,
  FaCreditCard,
  FaMapPin,
  FaXmark,
  FaWatchmanMonitoring,
} from "react-icons/fa6";
import { FiMail, FiPackage, FiTruck } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../../services/orderService";
import toast from "react-hot-toast";
import type { IOrder } from "../../types/Order";
import Image from "../../components/Image";
import ButtonColored from "../../components/Buttons/ButtonColored";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import StatusBadge from "../../components/Orders/StatusBadge";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const OrderSuccess = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "orders.orders.success",
  });
  const { formatCurrency } = useFormatCurrency();
  const { formatDate } = useDateFormatter();
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const {
        data: { order },
      } = await getOrder(orderId || "");
      setOrder(order);
    } catch (error: any) {
      console.log("Error : ", error);
      toast.error(error?.response?.data?.message || t("errors.fetchFailed"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setIsVisible(true);
    }
  }, [order]);

  const getOrderSteps = (status: string) => {
    const steps = [
      {
        icon: FaWatchmanMonitoring,
        label: t("steps.pending"),
        value: "pending",
        completed: false,
      },
      {
        icon: FaCheck,
        label: t("steps.confirmed"),
        value: "confirmed",
        completed: false,
      },
      {
        icon: FiTruck,
        label: t("steps.shipped"),
        value: "shipped",
        completed: false,
      },
      {
        icon: FiMail,
        label: t("steps.delivered"),
        value: "delivered",
        completed: false,
      },
      {
        icon: FaXmark,
        label: t("steps.cancelled"),
        value: "cancelled",
        completed: false,
      },
      {
        icon: FaArrowRight,
        label: t("steps.returned"),
        value: "returned",
        completed: false,
      },
    ];

    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);

    for (let i = 0; i <= currentIndex; i++)
      if (steps[i]) steps[i].completed = true;
    if (status === "cancelled") steps[4].completed = true;
    else if (status === "returned") steps[5].completed = true;

    return steps.filter((_, i) => {
      if (status === "cancelled") return i < 4 || i === 4;
      if (status === "returned") return i < 4 || i === 5;
      return i < 4;
    });
  };

  const getEstimatedDelivery = (createdAt: Date, deliveryMethod: string) => {
    const orderDate = new Date(createdAt);
    const deliveryDays = deliveryMethod === "pickup" ? 1 : 2;
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + deliveryDays);
    return estimatedDate;
  };

  if (loading) return <Loader screen />;

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaXmark className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("notFound.title")}
          </h1>
          <p className="text-gray-600">{t("notFound.subtitle")}</p>
        </div>
      </div>
    );
  }

  const orderSteps = getOrderSteps(order.status);
  const estimatedDelivery = getEstimatedDelivery(
    order.createdAt,
    order.deliveryMethod
  );

  return (
    <div className="min-h-screen bg-cold-gray relative overflow-hidden">
      <div className="relative container mx-auto px-4 py-10">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Success Header */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 ${
                order.status === "cancelled" || order.status === "returned"
                  ? "bg-red-400"
                  : "bg-green-400"
              } rounded-full mb-3 shadow-2xl animate-bounce`}
            >
              {order.status === "cancelled" || order.status === "returned" ? (
                <FaXmark className="w-10 h-10 text-white" />
              ) : (
                <FaCheck className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t(`status.title.${order.status}`)}
            </h1>
            <p className="text-gray-600 mt-2">
              {t(`status.subtitle.${order.status}`)}
            </p>
          </div>

          {/* Order Card */}
          <div className="bg-off-white backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-4 border border-cold-gray/20">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <FiPackage className="w-6 h-6 text-green-600" />
                  {t("orderCard.title")}
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("orderCard.orderNumber")}
                    </span>
                    <span className="font-mono font-semibold text-gray-800">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaCalendar className="w-4 h-4" />
                      {t("orderCard.orderDate")}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaCreditCard className="w-4 h-4" />
                      {t("orderCard.totalAmount")}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("orderCard.paymentMethod")}
                    </span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {t("orderCard." + order.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {t("orderCard.deliveryMethod")}
                    </span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {t("orderCard." + order.deliveryMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaMapPin className="w-4 h-4" />
                      {order.deliveryMethod === "home"
                        ? t("orderCard.shippingAddress")
                        : t("orderCard.pickupLocation")}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {order.deliveryInfo.fullName}
                      </div>
                      <div className="text-gray-600">
                        {order.deliveryInfo.commune},{" "}
                        {order.deliveryInfo.wilaya}
                      </div>
                      <div className="text-gray-600">
                        {order.deliveryInfo.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <FiTruck className="w-6 h-6 text-green-600" />
                  {order.deliveryMethod === "pickup"
                    ? t("timeline.pickupTitle")
                    : t("timeline.deliveryTitle")}
                </h2>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 mb-1">
                      {order.deliveryMethod === "pickup"
                        ? t("timeline.estimatedPickup")
                        : t("timeline.estimatedDelivery")}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatDate(estimatedDelivery)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("timeline.statusLabel")}:{" "}
                      <span className="capitalize font-semibold text-green-600">
                        <StatusBadge status={order.status} />
                      </span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    {orderSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                              step.completed
                                ? "bg-green-500 text-off-white shadow-lg"
                                : "bg-cold-gray border border-warm-gray/20 text-warm-gray/70"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`font-medium transition-colors duration-500 ${
                              step.completed
                                ? "text-green-700"
                                : "text-warm-gray/70"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {order.products.length > 0 && (
              <div className="mt-8 pt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FiPackage className="text-2xl" />
                  {t("items.title")}
                </h3>
                <div className="space-y-4">
                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-black/5 rounded-xl"
                    >
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fromServer
                          styles="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <div className="text-sm flex items-center text-warm-gray/70 mt-1">
                          <span className="flex items-center gap-1">
                            {t("items.color")}:{" "}
                            <span
                              style={{ backgroundColor: item.color }}
                              className="block border border-warm-gray/70 h-3 w-5 rounded-xs"
                            />
                          </span>
                          {item.size !== "onesize" && (
                            <span className="ml-2">
                              / {t("items.size")}: {item.size}
                            </span>
                          )}
                          <span className="ml-2">
                            / {t("items.qty")}: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {formatCurrency(item.product.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.product.price)} {t("items.each")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <ButtonColored
              variant="success"
              content={
                <Link className="flex gap-2 items-center group" to="/truck">
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  {t("actions.track")}
                </Link>
              }
            />
            <ButtonColored
              variant="cta"
              content={<Link to="/products">{t("actions.continue")}</Link>}
            />
          </div>

          {/* Help */}
          <div className="text-center mt-12 space-y-4">
            <p className="text-gray-600">{t("help.emailSent")}</p>
            <p className="text-sm text-gray-500">
              {t("help.needHelp")}{" "}
              <span className="text-blue-600 cursor-pointer font-semibold">
                {t("help.supportEmail")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
