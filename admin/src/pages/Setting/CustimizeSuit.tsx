import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { useForm } from "react-hook-form";
import Image from "../../components/Images/Image";
import Button from "../../components/Buttons/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/formData";
import InputField from "../../components/Inputs/InputField";
import SelectField from "../../components/Inputs/SelectField";
import {
  createSuitElement,
  deleteSuitElement,
  getSuitElements,
} from "../../services/suitElementService";
import { FaXmark } from "react-icons/fa6";
import { getProducts } from "../../services/productService";
import ConfirmationModal from "../../components/ConfirmationModal";
import toast from "react-hot-toast";

interface IProduct {
  _id: string;
  name: string;
  images: string[];
  price: number;
}

interface ISuitElement {
  _id: string;
  product: IProduct;
  type: string;
  color: {
    name: string;
    image: string;
  };
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

const suitTypes = [
  { _id: "jacket", name: "Jacket" },
  { _id: "pants", name: "Pants" },
  { _id: "shirt", name: "Shirt" },
  { _id: "tie", name: "Tie" },
  { _id: "shoes", name: "Shoes" },
  { _id: "vest", name: "Vest" },
  { _id: "belt", name: "Belt" },
  { _id: "accessory", name: "Accessory" },
];

const ImageUploader: React.FC<{
  onImageSelect: (file: File) => void;
  label: string;
  previewUrl?: string;
  onRemove: () => void;
}> = ({ onImageSelect, label, previewUrl, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  if (previewUrl) {
    return (
      <div className="relative">
        <Image
          src={previewUrl}
          alt="Preview"
          styles="w-full h-48 object-contain bg-warm-gray rounded-sm"
        />
        <Button
          action={onRemove}
          content="Change Image"
          variant="warning"
          styles="top-2 right-2 absolute"
        />
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      >
        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Click to upload {label}</p>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
      </button>
    </div>
  );
};

type FormData = {
  type: string;
  colorName: string;
  colorImage: File | null;
  productImage: File | null;
  product: IProduct | null;
};

const ProductSelectionModal: React.FC<{
  onSelect: (product: IProduct) => void;
  onCancel: () => void;
}> = ({ onSelect, onCancel }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState("");

  const fetchProductByName = async () => {
    try {
      const {
        data: { products },
      } = await getProducts({ name, limit: 20 });
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductByName();
  }, [name]);

  const handleSelect = () => {
    if (product) {
      onSelect(product);
    }
  };

  return (
    <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-off-black rounded-lg p-6 w-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2 text-left">
            Select Product
          </h3>
          <button
            onClick={onCancel}
            className="text-cold-gray/70 hover:text-off-white"
          >
            <FaXmark className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-cold-gray/90 text-left mb-0.5">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70"
            placeholder="Enter product name..."
            autoFocus
          />
        </div>
        <div className="h-[400px] overflow-y-auto p-2 pb-0 bg-warm-gray">
          {products.map((prod) => (
            <div
              onClick={() => setProduct(prod)}
              className={`flex items-center gap-3 p-2 mb-2 hover:bg-primary/90 rounded cursor-pointer ${
                product?._id === prod._id ? "bg-primary/90" : "bg-off-black"
              }`}
              key={prod._id}
            >
              <Image
                src={prod.images[0]}
                alt={prod.name}
                fromServer
                styles="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{prod.name}</p>
                <p className="text-xs text-cold-gray text-left">
                  {prod.price} DA
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-3 mt-4">
          <Button
            styles="flex-1"
            content="Cancel"
            action={onCancel}
            variant="secondary"
          />
          <Button
            styles="flex-1"
            content="Select Product"
            action={handleSelect}
            disabled={!product}
          />
        </div>
      </div>
    </div>
  );
};

const SuitElementManager: React.FC = () => {
  const [suitElements, setSuitElements] = useState<ISuitElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [viewingItem, setViewingItem] = useState<ISuitElement | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      type: "jacket",
      colorName: "",
      colorImage: null,
      productImage: null,
      product: null,
    },
  });

  const { register: registerType, watch: watchType } = useForm<{
    type: string;
  }>({
    defaultValues: {
      type: "",
    },
  });
  const type = watchType("type");

  const formValues = watch();

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await getSuitElements({ type });
      setSuitElements(data.suitElements);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const onSubmit = async (data: FormData) => {
    if (!data.productImage || !data.colorImage || !data.product) return;

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("colorName", data.colorName);
    formData.append("colorImage", data.colorImage);
    formData.append("productImage", data.productImage);
    formData.append("product", data.product._id);

    setLoading(true);
    try {
      const response = await createSuitElement(formData);
      setSuitElements([...suitElements, response.data.suitElement]);
      resetForm();
      toast.success("Success Creating Item");
    } catch (error) {
      toast.error("Error creating suit element");
      console.error("Error creating suit element:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSuitElement(id);
      setSuitElements(suitElements.filter((item) => item._id !== id));
      toast.success("Suit Elemnt Deleted");
      setSuitElements(suitElements.filter(({ _id }) => _id !== itemToDelete));
    } catch (error) {
      toast.error("Error deleting item");
      console.error("Error deleting item:", error);
    }
    setLoading(false);
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    reset();
    setShowForm(false);
  };

  const handleColorImageSelect = (file: File) => {
    setValue("colorImage", file);
  };

  const handleProductImageSelect = (file: File) => {
    setValue("productImage", file);
  };

  const removeImage = (field: "colorImage" | "productImage") => {
    setValue(field, null);
  };

  const handleProductSelect = (product: IProduct) => {
    setValue("product", product);
    setShowProductModal(false);
  };

  return (
    <div className="h-full w-full flex flex-col gap-3">
      <div className="flex items-center justify-between bg-off-black p-3">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Suit Elements Management</h1>
          <p className="text-cold-gray/70 text-sm">
            Manage jackets, pants, shirts and other suit elements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SelectField
            options={[{ _id: "", name: "All Types" }, ...suitTypes]}
            register={registerType}
            name="type"
          />
          <Button
            content={
              <>
                <FaPlus className="w-5 h-5" />
                <span>Add New Element</span>
              </>
            }
            action={() => setShowForm(true)}
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-off-black rounded-lg p-3 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">Add New Suit Element</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-4">
                  <SelectField
                    label="Element Type"
                    options={suitTypes}
                    register={register}
                    name="type"
                  />

                  <InputField
                    label="Color Name"
                    type="text"
                    register={register}
                    name="colorName"
                    placeholder="Enter color name (e.g., Navy Blue)"
                    validation={{ required: "The Color Name Is Required" }}
                    error={errors?.colorName}
                  />

                  <div>
                    <label className="block text-sm font-medium text-cold-gray/90 mb-2">
                      Color Image
                    </label>
                    <ImageUploader
                      onImageSelect={handleColorImageSelect}
                      label="color image"
                      previewUrl={
                        formValues.colorImage
                          ? URL.createObjectURL(formValues.colorImage)
                          : undefined
                      }
                      onRemove={() => removeImage("colorImage")}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cold-gray/90 mb-2">
                      Product Image
                    </label>
                    <ImageUploader
                      onImageSelect={handleProductImageSelect}
                      label="product image"
                      previewUrl={
                        formValues.productImage
                          ? URL.createObjectURL(formValues.productImage)
                          : undefined
                      }
                      onRemove={() => removeImage("productImage")}
                    />
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-cold-gray/90 mb-2">
                      Product
                    </label>
                    {formValues.product ? (
                      <div className="bg-warm-gray p-3 rounded-sm">
                        <div className="flex items-center gap-3">
                          <Image
                            src={formValues.product.images[0]}
                            alt={formValues.product.name}
                            fromServer
                            styles="w-16 h-16 object-cover rounded-sm"
                          />
                          <div>
                            <p className="font-medium">
                              {formValues.product.name}
                            </p>
                            <p className="text-sm text-cold-gray/80">
                              {formValues.product.price} DA
                            </p>
                          </div>
                          <button
                            onClick={() => setValue("product", null)}
                            className="ml-auto text-cold-gray/70 hover:text-off-white"
                          >
                            <FaXmark className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        content="Select Product"
                        action={() => setShowProductModal(true)}
                        variant="secondary"
                        styles="w-full"
                      />
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button
                      action={resetForm}
                      disabled={isSubmitting}
                      content="Cancel"
                      variant="secondary"
                    />
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formValues.product ||
                        !formValues.colorName ||
                        !formValues.productImage ||
                        !formValues.colorImage
                      }
                      content="Create"
                      variant="info"
                      loading={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductModal && (
        <ProductSelectionModal
          onSelect={handleProductSelect}
          onCancel={() => setShowProductModal(false)}
        />
      )}

      {/* View Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-warm-gray/90 bg-opacity-50 flex items-center justify-center p-3 z-40">
          <div className="bg-off-black rounded-sm p-4 pt-2 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">
                View{" "}
                {viewingItem.type.charAt(0).toUpperCase() +
                  viewingItem.type.slice(1)}
              </h2>
              <button
                onClick={() => setViewingItem(null)}
                className="text-cold-gray/70 hover:text-off-white cursor-pointer duration-200"
              >
                <FaXmark className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <h3 className="text-lg font-semibold mb-2">Color</h3>
                <div className="bg-warm-gray p-3 rounded-sm">
                  <Image
                    src={viewingItem.color.image}
                    alt={viewingItem.color.name}
                    styles="w-full h-64 object-contain"
                    fromServer
                  />
                  <p className="mt-2 text-center font-medium">
                    {viewingItem.color.name}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Product</h3>
                <div className="bg-warm-gray p-3 rounded-sm">
                  <Image
                    src={viewingItem.image}
                    alt={viewingItem.product.name}
                    styles="w-full h-64 object-contain"
                    fromServer
                  />
                  <div className="mt-2">
                    <p className="font-medium">{viewingItem.product.name}</p>
                    <p className="text-sm text-cold-gray/80">
                      {viewingItem.product.price} DA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-off-black flex-1 p-3 overflow-y-auto flex flex-col">
        <div className="grid grid-cols-5 pb-3 text-xs text-cold-gray/70 uppercase">
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Color</div>
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="bg-green-500 flex-1 p-2 overflow-y-auto min-h-0">
          {loading && suitElements.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner />
            </div>
          ) : suitElements.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <p className="text-lg text-center text-cold-gray/80">
                No suit elements found. Add your first element!
              </p>
            </div>
          ) : (
            suitElements.map((item) => (
              <div
                key={item._id}
                className="w-full grid grid-cols-5 items-center p-2 bg-off-black hover:bg-off-black/80 mb-2 last:mb-0"
              >
                <div className="col-span-1 capitalize">{item.type}</div>

                <div className="col-span-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-cold-gray/30 ">
                    <Image
                      src={item.color.image}
                      alt={item.color.name}
                      styles="w-full h-full object-cover"
                      fromServer
                    />
                  </div>
                  <span>{item.color.name}</span>
                </div>

                <div
                  className="col-span-1 flex items-center gap-2 cursor-pointer"
                  onClick={() => setViewingItem(item)}
                >
                  <div className="w-10 h-10 rounded-sm ">
                    <Image
                      src={item.image}
                      alt={item.product.name}
                      styles="w-full h-full object-cover"
                      fromServer
                    />
                  </div>
                  <span className="truncate">{item.product.name}</span>
                </div>

                <div className="col-span-1 text-center text-sm text-cold-gray/80">
                  {formatDate(item?.createdAt || "")}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-2 text-cold-gray/80">
                  <button
                    onClick={() => setViewingItem(item)}
                    title="View"
                    className="p-2 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(item._id);
                      setIsDeleteModalOpen(true);
                    }}
                    title="Delete"
                    className="p-2 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* {Confirm Modal} */}
      <ConfirmationModal
        type="delete"
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete("");
        }}
        onConfirm={() => handleDelete(itemToDelete)}
        title="Delete Suit Element"
        message="This Action Can not be undo"
      />
    </div>
  );
};

export default SuitElementManager;
