import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import Button from "../Buttons/Button";
import type { IOrderStatus } from "../../types/Order";

const StatusUpdateModal = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdateStatus,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: IOrderStatus;
  onUpdateStatus: (status: IOrderStatus, reason?: string) => void;
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<IOrderStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState<
    {
      value: IOrderStatus;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    // Reset selected status when modal opens
    setSelectedStatus(currentStatus);
    setReason("");

    // Determine available statuses based on current status
    const getAvailableStatuses = () => {
      const allStatuses: Record<IOrderStatus, string> = {
        pending: "Pending",
        confirmed: "Confirmed",
        shipped: "Shipped",
        delivered: "Delivered",
        returned: "Returned",
        cancelled: "Cancelled",
      };

      const statusFlow: Record<IOrderStatus, IOrderStatus[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered", "returned"],
        delivered: ["returned"],
        returned: [],
        cancelled: [],
      };

      // Can stay in current status or move to next possible statuses
      const possibleStatuses = [currentStatus, ...statusFlow[currentStatus]];

      return possibleStatuses.map((status) => ({
        value: status,
        label: allStatuses[status],
      }));
    };

    setAvailableStatuses(getAvailableStatuses());
  }, [currentStatus, isOpen]);

  const handleSubmit = () => {
    if (selectedStatus === "cancelled" || selectedStatus === "returned") {
      if (!reason.trim()) {
        alert("Please provide a reason for cancellation or return");
        return;
      }
      onUpdateStatus(selectedStatus, reason);
    } else {
      onUpdateStatus(selectedStatus);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-off-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-warm-gray rounded-xl w-full max-w-md mx-4 border border-cold-gray/20 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-cold-gray/30 sticky top-0 bg-warm-gray/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-off-white">
              Update Order Status
            </h2>
            <button
              onClick={onClose}
              className="text-cold-gray/70 hover:text-off-white cursor-pointer text-xl duration-200 hover:scale-110 transition-transform"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Selection */}
          <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
            <h3 className="font-medium text-cold-gray/70 uppercase text-sm tracking-wider mb-3">
              Current Status:{" "}
              <span className="text-off-white capitalize">{currentStatus}</span>
            </h3>

            <div className="mt-4">
              <label className="block text-sm font-medium text-cold-gray/70 uppercase tracking-wider mb-2">
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as IOrderStatus)
                }
                className="w-full p-3 bg-off-black/40 border border-cold-gray/20 rounded-sm text-off-white  focus:outline-none"
              >
                {availableStatuses.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-off-black text-off-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(selectedStatus === "cancelled" ||
            selectedStatus === "returned") && (
            <div className="bg-off-black/30 p-4 rounded-lg border border-cold-gray/15">
              <label className="block text-sm font-medium text-cold-gray/70 uppercase tracking-wider mb-2">
                Reason for {selectedStatus}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Explain why the order is being ${selectedStatus}...`}
                className="w-full p-3 bg-off-black/40 border border-cold-gray/20 resize-none rounded-sm text-off-white focus:outline-none "
                rows={4}
                required
              />
              <p className="text-xs text-cold-gray/70 mt-1">
                This reason will be shared with the customer.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              styles="flex-1"
              content={"Cancel"}
              variant="secondary"
              action={onClose}
            />
            <Button
              styles="flex-1"
              content={"Update Status"}
              disabled={
                selectedStatus === currentStatus ||
                ((selectedStatus === "cancelled" ||
                  selectedStatus === "returned") &&
                  !reason.trim())
              }
              variant={selectedStatus === currentStatus ? "secondary" : "cta"}
              action={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
