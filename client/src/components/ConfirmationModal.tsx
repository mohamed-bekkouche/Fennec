import React from "react";
import { GoAlertFill } from "react-icons/go";
import { FiEdit, FiSave, FiTrash } from "react-icons/fi";
import ButtonColored from "./Buttons/ButtonColored";
import { useTranslation } from "react-i18next";

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
  confirmText,
  cancelText,
  type = "default",
  isLoading = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getIconAndButtonVariant = () => {
    switch (type) {
      case "delete":
        return {
          icon: <FiTrash className="w-5 h-5" />,
          iconColor: "text-red-400",
          buttonVariant: "delete" as const,
          confirmText: confirmText || t("components.confirmationModal.delete"),
        };
      case "update":
        return {
          icon: <FiEdit className="w-5 h-5" />,
          iconColor: "text-blue-400",
          buttonVariant: "cta" as const,
          confirmText: confirmText || t("components.confirmationModal.update"),
        };
      case "save":
        return {
          icon: <FiSave className="w-5 h-5" />,
          iconColor: "text-green-400",
          buttonVariant: "success" as const,
          confirmText: confirmText || t("components.confirmationModal.save"),
        };
      case "warning":
        return {
          icon: <GoAlertFill className="w-5 h-5" />,
          iconColor: "text-yellow-400",
          buttonVariant: "warning" as const,
          confirmText: confirmText || t("components.confirmationModal.confirm"),
        };
      default:
        return {
          icon: <GoAlertFill className="w-5 h-5" />,
          iconColor: "text-blue-400",
          buttonVariant: "cta" as const,
          confirmText: confirmText || t("components.confirmationModal.confirm"),
        };
    }
  };

  const {
    icon,
    iconColor,
    buttonVariant,
    confirmText: finalConfirmText,
  } = getIconAndButtonVariant();

  return (
    <div className="fixed inset-0  bg-off-black/90 flex items-center justify-center z-[9999] overflow-hidden h-dvh">
      <div
        className="fixed inset-0 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      <div className="relative transform overflow-hidden rounded-lg bg-off-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div
              className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconColor}`}
            >
              {icon}
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <ButtonColored
            variant={buttonVariant}
            content={finalConfirmText}
            action={onConfirm}
            disabled={isLoading}
            styles="ml-3 sm:w-auto"
          />
          <ButtonColored
            variant="secondary"
            content={cancelText || t("components.confirmationModal.cancel")}
            action={onClose}
            disabled={isLoading}
            styles="ml-3 sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
