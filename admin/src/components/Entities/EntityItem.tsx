import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formData";
import Button from "../Buttons/Button";
import Image from "../Images/Image";
import { BsTrash3Fill } from "react-icons/bs";
import toast from "react-hot-toast";
import { FaPen } from "react-icons/fa6";
import ConfirmationModal from "../ConfirmationModal";
import { useState } from "react";
import type { IEntity } from "../../types/Entity";

interface EntityItemProps {
  entity: IEntity;
  onDelete: (id: string) => void;
  editRoute: string;
  deleteService: (id: string) => Promise<any>;
  entityType: "category" | "brand" | "collection";
}

const EntityItem = ({
  entity,
  onDelete,
  editRoute,
  deleteService,
  entityType,
}: EntityItemProps) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDelete = async () => {
    try {
      await deleteService(entity._id);
      onDelete(entity._id);
      toast.success(`${entityType} deleted successfully`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to delete ${entityType}`
      );
    }
  };

  return (
    <div
      key={entity._id}
      className="grid grid-cols-11 items-center gap-4 p-2 mb-2 bg-warm-gray hover:bg-warm-gray/80 transition-colors"
    >
      <div className="col-span-4 flex gap-3 items-center">
        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-white">
          <Image
            src={entity.image}
            alt={entity.name}
            fromServer
            styles="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{entity.name}</p>
          {entity.description && (
            <p className="text-xs text-cold-gray/50 line-clamp-1">
              {entity.description}
            </p>
          )}
        </div>
      </div>

      <div className="col-span-2 text-center">
        <span className="bg-dark-gray/30 px-3 py-1 rounded-full text-sm">
          {entity.totalProduct || 0}
        </span>
      </div>

      <div className="col-span-2 text-center">
        <p className="text-sm text-cold-gray/80">
          {formatDate(entity.createdAt)}
        </p>
      </div>

      <div className="col-span-3 flex justify-end gap-2">
        <Button
          content={
            <Link
              to={`${editRoute}/${entity._id}`}
              className="flex gap-2 items-center !px-3 !py-2"
            >
              <FaPen />
              Edit
            </Link>
          }
          variant="cta"
          styles="!px-0 !py-0 !capitalize"
        />
        <Button
          content={
            <>
              <BsTrash3Fill /> Delete
            </>
          }
          styles="!px-3 !py-2 !capitalize"
          variant="delete"
          action={() => setDeleteModal(true)}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title={`Delete ${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        }`}
        message={`Are you sure you want to delete this ${entityType}? This action can't be undone.`}
        type="delete"
        confirmText={`Delete ${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        }`}
      />
    </div>
  );
};

export default EntityItem;
