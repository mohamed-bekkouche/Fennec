import React from "react";
import { GoAlertFill } from "react-icons/go";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi";
import { FaXmark } from "react-icons/fa6";
import Button from "./Buttons/Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "update" | "save" | "warning" | "default";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIconAndButtonVariant = () => {
    switch (type) {
      case "delete":
        return {
          icon: <FiTrash className="w-5 h-5" />,
          iconColor: "text-red-400",
          buttonVariant: "delete" as const,
          confirmText: confirmText || "Delete",
        };
      case "update":
        return {
          icon: <FiEdit className="w-5 h-5" />,
          iconColor: "text-blue-400",
          buttonVariant: "info" as const,
          confirmText: confirmText || "Update",
        };
      case "save":
        return {
          icon: <FiSave className="w-5 h-5" />,
          iconColor: "text-green-400",
          buttonVariant: "success" as const,
          confirmText: confirmText || "Save",
        };
      case "warning":
        return {
          icon: <GoAlertFill className="w-5 h-5" />,
          iconColor: "text-yellow-400",
          buttonVariant: "warning" as const,
          confirmText: confirmText || "Continue",
        };
      default:
        return {
          icon: <GoAlertFill className="w-5 h-5" />,
          iconColor: "text-gray-400",
          buttonVariant: "secondary" as const,
          confirmText: confirmText || "Confirm",
        };
    }
  };

  const {
    icon,
    iconColor,
    buttonVariant,
    confirmText: finalConfirmText,
  } = getIconAndButtonVariant();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && !isLoading) {
      onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-off-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-warm-gray rounded-xl w-full max-w-md mx-4 border border-cold-gray/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-cold-gray/30 sticky top-0 bg-warm-gray/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={iconColor}>{icon}</div>
              <h2 className="text-xl font-bold text-off-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-cold-gray/70 hover:text-off-white cursor-pointer text-xl duration-200 hover:scale-110 transition-transform"
              disabled={isLoading}
            >
              <FaXmark />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div className="p-3">
            <p className="text-cold-gray/70 leading-relaxed text-[1rem]">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button
              styles="flex-1"
              content={cancelText}
              action={onClose}
              disabled={isLoading}
              variant="secondary"
            />
            <Button
              styles="flex-1"
              content={finalConfirmText}
              action={onConfirm}
              disabled={isLoading}
              loading={isLoading}
              variant={buttonVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
