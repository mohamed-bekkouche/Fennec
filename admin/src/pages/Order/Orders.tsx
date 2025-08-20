import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { getOrders } from "../../services/ordersService";
import type { IOrder, IOrderStatus } from "../../types/Order";
import OrderItem from "../../components/Orders/OrderItem";
import toast from "react-hot-toast";
import InputField from "../../components/Inputs/InputField";

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [pages, setPages] = useState<number>(1);
  const { register, watch } = useForm<{
    order: "asc" | "desc";
    status: IOrderStatus | null;
    deliveryMethod: "home" | "pickup" | null;
    sortBy: "totalPrice" | "createdAt" | "discount";
    orderNumber: string;
  }>({
    defaultValues: {
      status: null,
      order: "desc",
      deliveryMethod: null,
      sortBy: "createdAt",
      orderNumber: "",
    },
  });

  const { status, order, deliveryMethod, sortBy, orderNumber } = watch();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, _] = useState(10);

  const fetchOrders = async (params = {}) => {
    try {
      const { data } = await getOrders(params);
      console.log("Order Data : ", data);
      const { orders, pages } = data;
      setOrders(orders);
      setPages(pages);
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Failed to fetch orders");
    }
  };

  const onStatusUpdated = (orderId: string, status: IOrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord._id === orderId ? { ...ord, status } : ord))
    );
  };

  useEffect(() => {
    fetchOrders({
      deliveryMethod,
      sortBy,
      orderNumber,
      status,
      order,
      page: currentPage,
      limit,
    });
  }, [status, order, currentPage, limit, deliveryMethod, sortBy, orderNumber]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="bg-off-black p-3 rounded-sm flex items-center justify-between">
        <div className="w-sm">
          <InputField
            name="orderNumber"
            placeholder="Search For Product..."
            type="search"
            register={register}
            className="focus:!translate-y-0 !py-2 !mb-0"
          />
        </div>
        <div className="flex w-fit items-center gap-3">
          <select
            {...register("status")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">All orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            id="deliveryMethod"
            {...register("deliveryMethod")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">All Orders</option>
            <option value="home">Order to home</option>
            <option value="pickup">Order to pickup</option>
          </select>

          <select
            {...register("sortBy")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="totalPrice">Sort by Price</option>
            <option value="discount">Sort by Discount</option>
          </select>

          <select
            {...register("order")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="asc"> Ascending </option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="flex-1 h-full w-full bg-off-black overflow-hidden p-2 pb-0 rounded-sm flex flex-col">
        <div className="grid grid-cols-9 gap-4 text-cold-gray/70 text-xs uppercase tracking-wide mb-3 px-2">
          <div className="col-span-2">ID</div>
          <div className="col-span-2">User</div>
          <div className="col-span-1">Phone</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1 pl-2">Date</div>
          <div className="col-span-[1.5] text-center">Actions</div>
        </div>

        <div className="w-full flex-1 overflow-scroll">
          {orders.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onStatusUpdated={onStatusUpdated}
            />
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

export default Orders;
