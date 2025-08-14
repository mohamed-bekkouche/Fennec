import type { orderStatus } from "../../types/Order";
import { useTranslation } from "react-i18next";

const StatusBadge = ({ status }: { status: orderStatus }) => {
  const { t } = useTranslation();

  const statusConfig = {
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    shipped: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
    delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    returned: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    cancelled: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div
      className={` col-span-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      {t(`components.orders.statusLabels.${status}`)}
    </div>
  );
};

export default StatusBadge;
