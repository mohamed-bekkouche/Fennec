import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserWithOrders, toggleBlockUser } from "../../services/userService";
import Image from "../../components/Images/Image";
import Button from "../../components/Buttons/Button";
import {
  FaArrowLeft,
  FaShoppingBag,
  FaChartLine,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTimes,
  FaUndo,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserShield,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formData";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { IUser } from "../../types/User";
import type { IOrder } from "../../types/Order";
import { formatCurrency } from "../../utils/formatCurrency";
import OrderCard from "../../components/Orders/OrderCard";
import { FiPackage } from "react-icons/fi";
import StatCard from "../../components/Orders/StatCard";
import ConfirmationModal from "../../components/ConfirmationModal";
import { BsLockFill, BsUnlockFill } from "react-icons/bs";

interface OrderSummary {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalSpentOnDelivered: number;
  averageDeliveredOrderValue: number;
  lastDeliveredOrderDate: string;
}

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockModal, setBlockModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { data } = await getUserWithOrders(id!);
        setUser(data.user);
        setOrders(data.orders);
        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message || "Failed to load user details");
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${message} copied!`, {
          position: "top-center",
          duration: 2000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      })
      .catch((err) => {
        toast.error("Failed to copy", {
          position: "top-center",
          duration: 2000,
        });
        console.error("Failed to copy: ", err);
      });
  };

  const handleToggleBlockUser = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await toggleBlockUser(user._id);
      setBlockModal(false);
      toast.success(
        `User ${user?.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      setUser({ ...user, isBlocked: !user.isBlocked });
    } catch (error: any) {
      console.log("Error Blocking User: ", error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${user.isBlocked ? "unblock" : "block"} user`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!user) return <div className="p-4">User not found</div>;

  const completionRate = summary
    ? summary.totalOrders > 0
      ? ((summary.deliveredOrders / summary.totalOrders) * 100).toFixed(1)
      : 0
    : 0;

  return (
    <div className="flex flex-col w-full h-full gap-3 overflow-hidden">
      {/* Header */}
      <div className="bg-off-black p-3 rounded-sm flex items-center justify-between border border-warm-gray/20">
        <Link
          to="/users"
          className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors"
        >
          <FaArrowLeft />
          Back to Users
        </Link>
        <div className="flex gap-3">
          <Button
            styles="!px-3 !py-2 !capitalize"
            variant={user.isBlocked ? "cta" : "warning"}
            action={() => setBlockModal(true)}
            content={
              <>
                {user.isBlocked ? <BsUnlockFill /> : <BsLockFill />}
                {user.isBlocked ? "Unblock" : "Block"}
              </>
            }
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-3 min-h-0">
        <div className="col-span-1 bg-off-black p-3 h-full rounded-sm border border-warm-gray/20">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full overflow-hidden mb-3 ">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                fromServer={!user.avatar?.includes("http")}
                styles="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {user.username}
            </h2>
            <div className="flex items-center gap-3">
              <FaUserShield
                className={user.isAdmin ? "text-yellow-400" : "text-blue-400"}
              />
              <span className="text-cold-gray/70 text-sm">
                {user.isAdmin ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-3 hover:bg-warm-gray/10 rounded-sm cursor-pointer transition-colors border border-transparent hover:border-warm-gray/20"
              onClick={() => copyToClipboard(user.email, "Email")}
            >
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400" size={14} />
                <span className="text-cold-gray/70 text-sm">Email</span>
              </div>
              <span className="font-medium text-white text-sm truncate ml-2">
                {user.email}
              </span>
            </div>

            <div
              className="flex items-center justify-between p-3 hover:bg-warm-gray/10 rounded-sm cursor-pointer transition-colors border border-transparent hover:border-warm-gray/20"
              onClick={() => copyToClipboard(user._id, "User ID")}
            >
              <div className="flex items-center gap-3">
                <FaIdCard className="text-green-400" size={14} />
                <span className="text-cold-gray/70 text-sm">User ID</span>
              </div>
              <span className="font-medium text-white text-xs">
                {user._id.slice(-8)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-purple-400" size={14} />
                <span className="text-cold-gray/70 text-sm">Account Type</span>
              </div>
              <span className="font-medium text-white text-sm">
                {user.googleAccount ? "Google" : "Email"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user.isBlocked ? "bg-red-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-cold-gray/70 text-sm">Status</span>
              </div>
              <span
                className={`px-3 py-1 font-semibold rounded-full text-xs border ${
                  user.isBlocked
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-green-500/20 text-green-400 border-green-500/30"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-orange-400" size={14} />
                <span className="text-cold-gray/70 text-sm">Joined</span>
              </div>
              <span className="font-medium text-white text-sm">
                {formatDate(user.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <FaHeart className="text-red-400" size={14} />
                <span className="text-cold-gray/70 text-sm">Wishlist</span>
              </div>
              <span className="font-medium text-white text-sm">
                {user.wishList?.length || 0} items
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-3 min-h-0 ">
          {summary && (
            <div className="grid grid-cols-4 gap-3">
              <StatCard
                icon={FiPackage}
                title="Total Orders"
                value={summary.totalOrders}
                color="bg-blue-500/20"
              />
              <StatCard
                icon={FaCheckCircle}
                title="Delivered Orders"
                value={summary.deliveredOrders}
                subtitle={`${completionRate}% rate`}
                color="bg-green-500/20"
              />
              <StatCard
                icon={FaMoneyBillWave}
                title="Total Spent"
                value={formatCurrency(summary.totalSpentOnDelivered)}
                color="bg-purple-500/20"
              />
              <StatCard
                icon={FaChartLine}
                title="Average Order"
                value={formatCurrency(summary.averageDeliveredOrderValue)}
                color="bg-yellow-500/20"
              />
            </div>
          )}

          {summary && (
            <div className="grid grid-cols-3 gap-3">
              <StatCard
                icon={FaTimes}
                title="Cancelled Orders"
                value={summary.cancelledOrders}
                color="bg-amber-500/20"
              />
              <StatCard
                icon={FaUndo}
                title="Returned Orders"
                value={summary.returnedOrders}
                color="bg-red-500/20"
              />
              <StatCard
                icon={FaCalendarAlt}
                title="Last Order"
                value={
                  summary.lastDeliveredOrderDate
                    ? formatDate(summary.lastDeliveredOrderDate)
                    : "N/A"
                }
                color="bg-green-500/20"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col bg-off-black p-3 rounded-sm border border-warm-gray/20 min-h-0">
            <div className="flex items-center justify-between mb-3 border-b border-cold-gray/30 pb-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FaShoppingBag className="text-blue-400" />
                Order History
                <span className="text-sm font-normal text-cold-gray/70">
                  ({orders.length} orders)
                </span>
              </h3>

              {summary && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-cold-gray/70">
                      Delivered: {summary.deliveredOrders}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-cold-gray/70">
                      Issues: {summary.cancelledOrders + summary.returnedOrders}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-cold-gray/70 py-12">
                <FaShoppingBag size={48} className="mb-4 text-cold-gray/30" />
                <p className="text-lg">No orders found</p>
                <p className="text-sm">
                  This user hasn't placed any orders yet
                </p>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto bg-warm-gray p-2 pb-0">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={blockModal}
        onClose={() => setBlockModal(false)}
        onConfirm={handleToggleBlockUser}
        title={user.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${
          user.isBlocked ? "unblock" : "block"
        } this user? ${
          user.isBlocked
            ? "They will be able to access their account again."
            : "They will not be able to access their account until unblocked."
        }`}
        type={user.isBlocked ? "save" : "warning"}
        confirmText={user.isBlocked ? "Unblock" : "Block"}
        isLoading={loading}
      />
    </div>
  );
};

export default User;
