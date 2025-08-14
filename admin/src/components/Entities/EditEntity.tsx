import { useEffect, useState } from "react";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Buttons/Button";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";
import CategoryForm from "../Categories/CategoryForm";
import BrandForm from "../Brands/BrandForm";
import CollectionForm from "../Collections/CollectionForm";

interface EditEntityProps {
  entityType: "category" | "brand" | "collection";
  getEntity: (id: string) => Promise<any>;
  deleteEntity: (id: string) => Promise<any>;
  updateEntity: (id: string, data: FormData) => Promise<any>;
  listRoute: string;
}

const EditEntity = ({
  entityType,
  getEntity,
  deleteEntity,
  updateEntity,
  listRoute,
}: EditEntityProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleEntityEdit = async (data: any, resetForm: () => void) => {
    const { name, description, image } = data;
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);
    try {
      await updateEntity(id as string, formData);
      toast.success(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } updated successfully`
      );
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to update ${entityType}`
      );
    }
  };

  const fetchEntity = async () => {
    try {
      const { data } = await getEntity(id || "");
      console.log("The ENtity : ", data);
      setEntity(data[entityType]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to fetch ${entityType}`
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntity(id as string);
      toast.success(
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${
          entity?.name
        } deleted successfully`
      );
      navigate(listRoute);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to delete ${entityType}`
      );
    }
  };

  useEffect(() => {
    fetchEntity();
  }, [id]);

  if (!entity) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex gap-3 flex-col">
      <div className="flex items-center justify-between bg-off-black rounded-xs p-3">
        <Link
          to={listRoute}
          className="flex items-center gap-2 text-off-white hover:text-primary transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          <span className="font-medium">
            Back to {entityType.charAt(0).toUpperCase() + entityType.slice(1)}s
          </span>
        </Link>

        <div className="flex gap-3">
          <Button
            styles="!py-2"
            action={() => setDeleteModal(true)}
            variant="delete"
            content={
              <>
                <FiTrash2 />
                <span className="capitalize">Delete</span>
              </>
            }
          />
        </div>
      </div>

      <div className="flex-1 rounded-xs p-3 bg-off-black">
        <h1 className="text-2xl font-semibold text-off-white mb-6">
          {entityType === "category"
            ? "Edit Category"
            : entityType === "brand"
            ? "Edit Brand"
            : "Edit Collection"}
        </h1>

        {entityType === "category" ? (
          <CategoryForm
            category={entity}
            onSubmit={handleEntityEdit}
            action="edit"
          />
        ) : entityType === "brand" ? (
          <BrandForm brand={entity} onSubmit={handleEntityEdit} action="edit" />
        ) : (
          <CollectionForm
            collection={entity}
            onSubmit={handleEntityEdit}
            action="edit"
          />
        )}
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

export default EditEntity;
