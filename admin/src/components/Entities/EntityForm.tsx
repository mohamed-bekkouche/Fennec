// components/Entities/EntityForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import Image from "../Images/Image";
import InputField from "../Inputs/InputField";
import { FaImage } from "react-icons/fa6";
import Button from "../Buttons/Button";
import type { IEntity } from "../../types/Entity";

interface IEntityFormData {
  name: string;
  description: string;
  image: File | null;
}

interface EntityFormProps {
  entity?: IEntity;
  onSubmit: (data: any, resetForm: () => void) => void;
  action?: "create" | "edit";
  entityType: "category" | "brand" | "collection";
}

const EntityForm = ({
  entity,
  onSubmit,
  action = "create",
  entityType,
}: EntityFormProps) => {
  const {
    setValue,
    formState: { errors, isValid, isDirty, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<IEntityFormData>({
    mode: "all",
    defaultValues: {
      name: entity?.name || "",
      description: entity?.description || "",
      image: null,
    },
  });

  const formValues = watch();
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(entity?.image || "");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const file = files[0];

    if (!file.type.startsWith("image/") || file.size >= 5 * 1024 * 1024) {
      toast.error("File should be type Image & smaller than 5MB");
      return;
    }

    setValue("image", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleReset = () => {
    reset({
      name: entity?.name || "",
      description: entity?.description || "",
      image: null,
    });
    if (!entity) {
      setImagePreview("");
    }
  };

  const hasChanges = () => {
    if (action === "create") {
      return !isDirty;
    }
    return (
      (entity?.name === formValues.name &&
        entity?.description === formValues.description &&
        entity?.image === imagePreview) ||
      !isDirty
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, handleReset))}
      className="max-w-5xl mx-auto flex items-start w-full gap-10"
    >
      <div className="w-1/2">
        {!imagePreview ? (
          <>
            <label className="capitalize text-sm mb-1">
              Image
              <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 group border-dashed cursor-pointer rounded-xl h-96 transition-all flex justify-center items-center ${
                dragActive
                  ? "border-cold-gray/70 bg-primary/40"
                  : "border-cold-gray/70 hover:border-cold-gray"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="text-cold-gray/70 text-center block">
                <FiUpload className="w-16 h-16 text-cold-gray/70 group-hover:text-cold-gray duration-200 mx-auto mb-4" />
                <p className="mb-2">
                  Drag & drop image here, or{" "}
                  <span className="text-primary font-medium underline cursor-pointer">
                    browse
                  </span>
                </p>
                <p className="text-sm">One image, less than 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </>
        ) : (
          <div className="w-full bg-white h-96 mt-5 rounded-sm overflow-hidden relative aspect-square">
            <Image
              src={imagePreview}
              styles="w-full h-full object-cover"
              alt={entityType}
              fromServer={!imagePreview.includes("http")}
            />
            <Button
              variant="cta"
              type="button"
              styles="absolute bottom-2 right-2 !rounded-full !py-0 !px-0 !cursor-pointer"
              content={
                <label className="cursor-pointer px-4 py-2 flex items-center gap-2">
                  <span className="text-sm">Upload New Image</span>
                  <FaImage className="text-lg" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              }
            />
          </div>
        )}
      </div>

      <div className="w-1/2">
        <InputField
          register={register}
          name="name"
          placeholder={`${
            entityType.charAt(0).toUpperCase() + entityType.slice(1)
          } name`}
          label="Name"
          validation={{
            required: `${
              entityType.charAt(0).toUpperCase() + entityType.slice(1)
            } name is required`,
            minLength: {
              value: 3,
              message: `${
                entityType.charAt(0).toUpperCase() + entityType.slice(1)
              } name must be at least 3 characters`,
            },
          }}
          error={errors.name}
        />
        <div className="mb-1">
          <label className="capitalize text-sm mb-0.5">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full mb-2 text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70 focus:outline-none resize-none min-h-60 ${
              errors.description?.message &&
              "border border-red-500 focus:border-red-500 !mb-0"
            }`}
            {...register("description", {
              required: `${
                entityType.charAt(0).toUpperCase() + entityType.slice(1)
              } description is required`,
              minLength: {
                value: 10,
                message: `${
                  entityType.charAt(0).toUpperCase() + entityType.slice(1)
                } description must be at least 10 characters`,
              },
            })}
          />
          {errors.description?.message && (
            <p className="text-red-500 text-sm mb-2">
              {errors.description?.message}
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            styles="!w-full !py-3"
            content={
              action === "create"
                ? `Create ${
                    entityType.charAt(0).toUpperCase() + entityType.slice(1)
                  }`
                : "Save Changes"
            }
            variant={action === "create" ? "cta" : "success"}
            disabled={hasChanges() || !isValid || isSubmitting || !imagePreview}
            loading={isSubmitting}
            type="submit"
          />
        </div>
      </div>
    </form>
  );
};

export default EntityForm;
