import { useState, useEffect, useRef } from "react";
import SectionHeader from "../../components/SectionHeader";
import {
  FaBox,
  FaEye,
  FaFilter,
  FaMoneyBill,
  FaTruck,
  FaCalendar,
  FaPlus,
} from "react-icons/fa6";
import { FiHome, FiTruck } from "react-icons/fi";
import { getOrders } from "../../services/orderService";

import Pagination from "../../components/Pagination";
import type { IOrder, orderStatus } from "../../types/Order";
import Image from "../../components/Image";
import ButtonColored from "../../components/Buttons/ButtonColored";
import { useForm } from "react-hook-form";
import InputField from "../../components/Inputs/InputField";
import SelectField from "../../components/Inputs/SelectField";
import OrderPreviewModal from "../../components/Orders/OrderPreviewModal";
import { useTranslation } from "react-i18next";
import { useDateFormatter } from "../../hooks/useDateFormatter";

const Orders = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "orders.orders.list" });
  const { formatDate } = useDateFormatter();
  const { register, watch, reset } = useForm<{
    orderNumber: string;
    status: orderStatus | null;
    deliveryMethod: "home" | "pickup" | null;
  }>({
    defaultValues: {
      orderNumber: "",
      status: null,
      deliveryMethod: null,
    },
  });

  const { orderNumber, status, deliveryMethod } = watch();

  const ordersRef = useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [orderPreview, setOrderPreview] = useState<IOrder | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  const statuses: orderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "returned",
    "cancelled",
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const {
        data: { orders, pages },
      } = await getOrders({
        orderNumber,
        status,
        deliveryMethod,
        page: currentPage,
        limit,
      });
      setOrders(orders);
      setPages(pages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [orderNumber, status, deliveryMethod]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, orderNumber, status, deliveryMethod]);

  const getStatusColor = (status: orderStatus) => {
    const colors: Record<orderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      returned: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: orderStatus) => {
    const icons: Record<orderStatus, string> = {
      pending: "⏳",
      confirmed: "✅",
      shipped: "🚚",
      delivered: "📦",
      returned: "↩️",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const clearFilters = () => reset();

  const handlePageChange = (newPage: number) => {
    ordersRef.current?.scrollIntoView({ behavior: "smooth" });
    setCurrentPage(newPage);
  };

  const closeOrderModal = () => {
    setOrderPreview(null);
    setIsPreviewModalOpen(false);
  };
  const openOrderModal = (order: IOrder) => {
    setOrderPreview(order);
    setIsPreviewModalOpen(true);
  };

  return (
    <div ref={ordersRef} className="">
      <SectionHeader
        title={t("header.title")}
        subTitle={t("header.subTitle", { count: orders.length })}
      />

      {/* Filters */}
      <div className="bg-off-white shadow-sm hover:shadow-md duration-200 mb-6">
        <div className="flex items-center gap-2 font-medium text-sm uppercase text-off-white bg-off-black px-4 py-3 ">
          <FaFilter size={16} />
          {t("filters.title")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch bg-off-white p-4 pb-2">
          {/* Search */}
          <InputField
            register={register}
            name="orderNumber"
            placeholder={t("filters.searchPlaceholder")}
            type="search"
          />

          {/* Delivery Method Filter */}
          <SelectField
            name="deliveryMethod"
            options={[
              { _id: "home", name: t("filters.deliveryMethod.home") },
              { _id: "pickup", name: t("filters.deliveryMethod.pickup") },
            ]}
            register={register}
            noValue={t("filters.deliveryMethod.all")}
          />

          {/* Status Filter */}
          <SelectField
            name="status"
            options={statuses.map((s) => ({
              _id: s,
              name: t(`filters.status.${s}`),
            }))}
            register={register}
            noValue={t("filters.status.all")}
          />

          {/* Clear Filters */}
          <ButtonColored
            styles="!px-3 !h-11"
            variant="delete"
            type="button"
            content={t("filters.clear")}
            action={clearFilters}
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaBox size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t("empty.title")}</p>
          <p className="text-gray-400 text-sm mt-2">{t("empty.hint")}</p>
        </div>
      ) : (
        <>
          {/* Table Header - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 py-4 px-6 bg-off-black font-medium text-off-white text-sm uppercase tracking-wide">
            <div className="col-span-2">{t("table.orderId")}</div>
            <div className="col-span-2">{t("table.date")}</div>
            <div className="col-span-2">{t("table.products")}</div>
            <div className="col-span-2">{t("table.status")}</div>
            <div className="col-span-1">{t("table.delivery")}</div>
            <div className="col-span-2">{t("table.total")}</div>
            <div className="col-span-1 text-right">{t("table.actions")}</div>
          </div>

          {/* Orders List */}
          <div className="space-y-4 mb-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-off-white shadow-sm hover:shadow-md duration-200 p-6"
              >
                {/* Mobile */}
                <div className="lg:hidden space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-off-black">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FaCalendar size={12} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}{" "}
                      {t(`filters.status.${order.status}`)}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {order.products.slice(0, 3).map(({ product }, index) => (
                      <div
                        key={`${order._id}-product-${index}`}
                        className="w-12 h-12 border-[0.5px] border-primary overflow-hidden rounded-full first:ml-0 -ml-6"
                      >
                        <Image
                          fromServer
                          src={product.images[0]}
                          alt={product.name}
                          styles="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.products.length - 3 > 0 && (
                      <div className="w-12 h-12 bg-off-black/90 text-off-white overflow-hidden rounded-full -ml-6 flex items-center justify-center gap-0.5 text-[1rem] font-bold">
                        <FaPlus size={14} /> {order.products.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {order.deliveryMethod === "home" ? (
                          <FiHome size={14} />
                        ) : (
                          <FaTruck size={14} />
                        )}
                        {t(`order.deliveryMethod.${order.deliveryMethod}`)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FaMoneyBill size={14} />
                        {t("order.paymentMethod.cash")}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {order.totalPrice.toFixed(2)} DA
                      </p>
                      {order.discount && order.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {order.originalPrice.toFixed(2)} DA
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <ButtonColored
                      variant="success"
                      action={() => openOrderModal(order)}
                      styles="!w-full"
                      content={
                        <>
                          <FaEye size={12} />
                          {t("order.detail")}
                        </>
                      }
                    />
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="font-semibold text-off-black">
                      {order.orderNumber}
                    </p>
                  </div>

                  <div className="col-span-2 flex">
                    {order.products.slice(0, 3).map(({ product }, index) => (
                      <div
                        key={`${order._id}-desktop-product-${index}`}
                        className="w-14 h-14 border-[0.5px] border-primary overflow-hidden rounded-full first:ml-0 -ml-6"
                      >
                        <Image
                          fromServer
                          src={product.images[0]}
                          alt={product.name}
                          styles="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.products.length - 3 > 0 && (
                      <div className="w-14 h-14 bg-off-black/90 text-off-white overflow-hidden rounded-full -ml-6 flex items-center justify-center gap-0.5 text-[1rem] font-bold">
                        <FaPlus size={14} /> {order.products.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaCalendar size={12} />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}{" "}
                      {t(`filters.status.${order.status}`)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {order.deliveryMethod === "home" ? (
                        <FiHome size={14} />
                      ) : (
                        <FiTruck size={14} />
                      )}
                      {t(`order.deliveryMethod.${order.deliveryMethod}`)}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-bold text-green-600">
                      {order.totalPrice.toFixed(0)} DA
                    </p>
                    {order.discount && order.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        {order.originalPrice.toFixed(0)} DA
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 text-right">
                    <ButtonColored
                      variant="success"
                      action={() => openOrderModal(order)}
                      styles="!px-3"
                      content={
                        <>
                          <FaEye size={12} />
                          {t("order.detail")}
                        </>
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={pages}
            onPageChange={handlePageChange}
          />

          <OrderPreviewModal
            isOpen={isPreviewModalOpen}
            order={orderPreview as IOrder}
            onClose={closeOrderModal}
          />
        </>
      )}
    </div>
  );
};

export default Orders;
