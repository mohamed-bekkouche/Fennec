import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { MdFileUploadOff } from "react-icons/md";
import RichTextEditor from "../../components/TextEditor";
import Image from "../../components/Images/Image";
import InputField from "../../components/Inputs/InputField";
import Button from "../../components/Buttons/Button";
import { createProduct, updateProduct } from "../../services/productService";
import toast from "react-hot-toast";
import { useMeta } from "../../hooks/useMeta";
import type { IProduct } from "../../types/Product";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  brand: string;
  seasonCollection: string;
  sizes: (string | number)[] | "onsize";
  colors: string[];
  images: File[];
  newImages: File[];
  deletedImages: string[];
  existingImages: string[];
}

interface ProductFormProps {
  product?: IProduct | null;
}

export default function NewProduct({ product }: ProductFormProps) {
  const isEditMode = Boolean(product);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    mode: "onBlur",
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      cost: product?.cost || 0,
      category: product?.category._id || "",
      stock: product?.stock || 0,
      seasonCollection: product?.seasonCollection?._id || "",
      brand: product?.brand?._id || "",
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      images: [],
      newImages: [],
      deletedImages: [],
      existingImages: product?.images || [],
    },
  });

  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Watch form values
  const watchedNewImages = watch("newImages");
  const watchedExistingImages = watch("existingImages");
  const watchedDeletedImages = watch("deletedImages");
  const watchedSizes = watch("sizes");
  const watchedColors = watch("colors");

  // Combined images for display (existing + new)
  const allImages = [
    ...watchedExistingImages.map((url: string) => ({
      type: "existing",
      src: url,
    })),
    ...watchedNewImages.map((file: File) => ({
      type: "new",
      src: URL.createObjectURL(file),
      file,
    })),
  ];

  const { categories, collections, brands } = useMeta();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        category: product.category._id,
        stock: product.stock,
        seasonCollection: product.seasonCollection._id,
        brand: product.brand._id,
        sizes: product.sizes,
        colors: product.colors,
        images: [],
        newImages: [],
        deletedImages: [],
        existingImages: product.images,
      });
    }
  }, [product, reset]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size < 5 * 1024 * 1024
    );

    const currentNewImages = watchedNewImages || [];
    const totalCurrentImages = allImages.length;
    const maxNewImages = 10 - totalCurrentImages;

    if (maxNewImages > 0) {
      const newImages = [...currentNewImages, ...validFiles].slice(
        0,
        maxNewImages
      );
      setValue("newImages", newImages);
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = allImages[index];

    if (imageToRemove.type === "existing") {
      // Mark existing image for deletion
      const currentDeleted = watchedDeletedImages || [];
      const currentExisting = watchedExistingImages || [];

      setValue("deletedImages", [...currentDeleted, imageToRemove.src]);
      setValue(
        "existingImages",
        currentExisting.filter((url) => url !== imageToRemove.src)
      );
    } else {
      // Remove new image
      const currentNewImages = watchedNewImages || [];
      const existingImageCount = watchedExistingImages.length;
      const newImageIndex = index - existingImageCount;

      const newImages = currentNewImages.filter((_, i) => i !== newImageIndex);
      setValue("newImages", newImages);
    }
  };

  const addSize = () => {
    if (newSize.trim()) {
      const numericSize = Number(newSize.trim());
      const sizeToAdd = !isNaN(numericSize) ? numericSize : newSize.trim();

      const sizeExists = (watchedSizes as (string | number)[]).some(
        (size) =>
          size.toString().toLowerCase() === sizeToAdd.toString().toLowerCase()
      );

      if (!sizeExists) {
        const newSizes = [...watchedSizes, sizeToAdd];
        setValue("sizes", newSizes);
        setNewSize("");
      }
    }
  };

  const removeSize = (size: string | number) => {
    const newSizes = (watchedSizes as (string | number)[]).filter(
      (s) => s !== size
    );
    setValue("sizes", newSizes);
  };

  const handleOneSizeToggle = (checked: boolean) => {
    if (checked) {
      setValue("sizes", "onsize");
    } else {
      setValue("sizes", []);
    }
  };

  const addColor = () => {
    if (newColor.trim() && !watchedColors.includes(newColor.trim())) {
      const newColors = [...watchedColors, newColor.trim()];
      setValue("colors", newColors);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    const newColors = watchedColors.filter((c) => c !== color);
    setValue("colors", newColors);
  };

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

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formDataToSend = new FormData();

      if (isEditMode && product) {
        // Append only update-related fields
        Object.entries(data).forEach(([key, value]) => {
          if (key === "newImages") {
            value.forEach((file: File) =>
              formDataToSend.append("images", file)
            );
          } else if (key === "deletedImages" || key === "existingImages") {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key === "images") {
            return;
          } else if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, value);
          }
        });

        await updateProduct(product._id, formDataToSend);
        toast.success("Product updated successfully");
      } else {
        // Append only fields that are not image-management-related
        Object.entries(data).forEach(([key, value]) => {
          if (
            key === "newImages" ||
            key === "deletedImages" ||
            key === "existingImages"
          ) {
            // Skip these in create mode
            return;
          } else if (Array.isArray(value)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, value);
          }
        });

        // Append the actual images from newImages
        data.newImages.forEach((file: File) =>
          formDataToSend.append("images", file)
        );

        await createProduct(formDataToSend);
        toast.success("Product created successfully");
      }

      if (!isEditMode) {
        reset();
        setNewSize("");
        setNewColor("");
      }
    } catch (error: any) {
      console.error("Error : ", error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} product`
      );
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-off-black p-3">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Update Product" : "Create New Product"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <div className="mb-4">
          <label className="mb-1 block capitalize font-medium text-sm">
            Product Images <span className="text-red-500"> * </span>
          </label>
          <div className="grid grid-rows-2 grid-cols-6 h-72 gap-5">
            {allImages.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg group ${
                  index === 0
                    ? "col-span-2 row-span-2"
                    : `col-span-1 row-span-1`
                }`}
              >
                <Image
                  src={image.src}
                  alt={`Preview ${index + 1}`}
                  styles="w-full h-full object-cover rounded-lg"
                  fromServer={image.type === "existing"}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute z-10 cursor-pointer -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaXmark className="w-4 h-4" />
                </button>
                {allImages.length > 8 && index === 7 && (
                  <div className="absolute top-0 left-0 w-full h-full bg-off-black/70 rounded-lg flex items-center justify-center">
                    <FaPlus /> {allImages.length - 8} Images
                  </div>
                )}
                {index === 0 && (
                  <div className="absolute opacity-0 group-hover:opacity-100 duration-200 top-0 left-0 w-full h-full bg-off-black/70 rounded-lg flex items-end pb-5 justify-center">
                    <p className="font-medium uppercase text-sm">
                      {" "}
                      Main Image{" "}
                    </p>
                  </div>
                )}
                {/* Show indicator for image type in edit mode */}
                {isEditMode && (
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        image.type === "existing"
                          ? "bg-primary text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {image.type === "existing" ? "Existing" : "New"}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div
              className={`border-2 border-dashed cursor-pointer rounded-xl p-2 text-center transition-all flex justify-center items-center ${
                dragActive
                  ? "border-primary bg-primary/40"
                  : "border-primary/70 hover:border-primary"
              } ${
                allImages.length === 0
                  ? "col-span-6 row-span-2"
                  : "col-span-1 row-span-1"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {allImages.length === 0 ? (
                <label className="text-cold-gray/70 text-center block">
                  <FiUpload className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="mb-2">
                    Drag & drop images here, or{" "}
                    <span className="text-primary font-medium underline">
                      browse
                    </span>
                  </p>
                  <p className="text-sm">Maximum 10 images, 5MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              ) : allImages.length >= 10 ? (
                <div className="flex flex-col items-center text-gray-400">
                  <MdFileUploadOff className="w-12 h-12 mb-2" />
                  <p className="text-sm">Maximum of 10 images reached</p>
                </div>
              ) : (
                <label className="text-cold-gray/70 cursor-pointer flex flex-col items-center gap-1">
                  <FiUpload className="w-14 h-14 text-primary" />
                  <p className="text-sm text-primary">Add more</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-5 mb-4">
          <div className="w-1/2">
            <InputField
              name="name"
              label="Product Name"
              placeholder="Enter product name"
              register={register}
              validation={{
                required: "Product name is required",
                minLength: {
                  value: 3,
                  message: "Product name must be at least 3 characters",
                },
              }}
              error={errors.name}
            />
          </div>
          <div className="w-1/2">
            <label className=" capitalize text-sm mb-1">
              Collection <span className="text-red-500">*</span>
            </label>
            <select
              {...register("seasonCollection", {
                required: "Collection is required",
              })}
              className={`w-full px-2 py-[11px] border rounded-sm focus:outline-none transition-all ${
                errors.seasonCollection
                  ? "border-red-500 focus:border-red-500"
                  : "border-cold-gray/70 focus:border-cold-gray"
              }`}
            >
              <option className="text-sm" value="">
                Select a collection
              </option>
              {collections.map((collection) => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>
            {errors.seasonCollection && (
              <p className="text-red-500 text-sm mt-1">
                {errors.seasonCollection.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-stretch gap-5 mb-4">
          {/* Description */}
          <div className="flex-1 flex-col">
            <label className="block text-sm text-cold-gray mb-0.5">
              Description <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter detailed product description..."
                  className="w-full flex-1"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Basic Information */}
          <div className="w-[420px] flex flex-col gap-2">
            <InputField
              name="price"
              type="number"
              label="Price"
              placeholder="0.00"
              register={register}
              validation={{
                required: "Price is required",
                min: {
                  value: 0.01,
                  message: "Price must be greater than 0",
                },
              }}
              error={errors.price}
            />
            <InputField
              name="cost"
              type="number"
              label="Cost"
              placeholder="0.00"
              register={register}
              validation={{
                required: "Cost is required",
                min: {
                  value: 0,
                  message: "Cost must be 0 or greater",
                },
              }}
              error={errors.cost}
            />
            <InputField
              name="stock"
              type="number"
              label="Stock"
              placeholder="0"
              register={register}
              validation={{
                required: "Stock is required",
                min: {
                  value: 0,
                  message: "Stock must be 0 or greater",
                },
              }}
              error={errors.stock}
            />
            <div>
              <label className=" capitalize text-sm mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                {...register("brand", { required: "Brand is required" })}
                className={`w-full px-2 py-2.5 border rounded-sm focus:outline-none transition-all ${
                  errors.brand
                    ? "border-red-500 focus:border-red-500"
                    : "border-cold-gray/70 focus:border-cold-gray"
                }`}
              >
                <option className="text-sm" value="">
                  Select a brand
                </option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div>
              <label className=" capitalize text-sm mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-2 py-2.5 border rounded-sm focus:outline-none transition-all ${
                  errors.category
                    ? "border-red-500 focus:border-red-500"
                    : "border-cold-gray/70 focus:border-cold-gray"
                }`}
              >
                <option className="text-xs" value="">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label className=" capitalize text-sm mb-3">
            Sizes <span className="text-red-500">*</span>
          </label>

          {/* One Size Toggle */}
          <div className="mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={watchedSizes === "onsize"}
                onChange={(e) => handleOneSizeToggle(e.target.checked)}
                className=" accent-primary rounded-xs w-5 h-5"
              />
              <span className="capitalize text-sm">One Size Only</span>
            </label>
          </div>

          {watchedSizes !== "onsize" && (
            <>
              {/* Custom Size Input */}
              <div className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add custom size (e.g., S, M, L, 32, 34)"
                  className={`w-full text-off-white bg-off-black border border-off-white shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70 appearance-none $`}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSize())
                  }
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-3 bg-primary cursor-pointer text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Selected Sizes Display */}
          <div className="flex flex-wrap gap-2">
            {typeof watchedSizes !== "string" &&
              watchedSizes?.map((size, index) => (
                <span
                  key={index}
                  className="flex uppercase items-center gap-2 pl-3 pr-2 py-1 text-off-black bg-off-white rounded-full text-sm"
                >
                  {size}

                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="p-1 bg-red-50 rounded-full group hover:bg-red-500 duration-200 cursor-pointer"
                  >
                    <FaXmark className="text-red-500 group-hover:text-white duration-200 text-sm" />
                  </button>
                </span>
              ))}
          </div>
          {watchedSizes?.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              At least one size is required
            </p>
          )}
        </div>

        {/* Colors */}
        <div className="mb-4">
          <label className=" capitalize text-sm mb-2">
            Colors <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add color (e.g., Red, Blue)"
              className={`w-full text-off-white bg-off-black border border-off-white shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70 appearance-none $`}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addColor())
              }
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-3 bg-primary cursor-pointer text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              <FaPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedColors?.map((color, index) => (
              <span
                key={index}
                className="flex uppercase items-center gap-2 pl-3 pr-2 py-1 text-off-black bg-off-white rounded-full text-sm"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="p-1 bg-red-50 rounded-full group hover:bg-red-500 duration-200 cursor-pointer"
                >
                  <FaXmark className="text-red-500 group-hover:text-white duration-200 text-sm" />
                </button>
              </span>
            ))}
          </div>
          {watchedColors?.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              At least one color is required
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            content={isEditMode ? "Update Product" : "Create Product"}
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
