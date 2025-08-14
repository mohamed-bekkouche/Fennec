// pages/CreateEntity.tsx
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface CreateEntityProps {
  entityType: "category" | "brand" | "collection";
  createService: (formData: FormData) => Promise<any>;
  listRoute: string;
  FormComponent: React.ComponentType<{
    onSubmit: (data: any, resetForm: () => void) => void;
  }>;
}

const CreateEntity = ({
  entityType,
  createService,
  listRoute,
  FormComponent,
}: CreateEntityProps) => {
  const handleEntityCreation = async (data: any, resetForm: () => void) => {
    const { name, description, image } = data;
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (description) formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await createService(formData);
      toast.success(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } Created Successfully`
      );
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to create ${entityType}`
      );
    }
  };

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
      </div>

      <div className="flex-1 rounded-xs p-3 bg-off-black">
        <h1 className="text-2xl font-semibold text-off-white mb-6">
          Create New {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
        </h1>

        <FormComponent onSubmit={handleEntityCreation} />
      </div>
    </div>
  );
};

export default CreateEntity;
