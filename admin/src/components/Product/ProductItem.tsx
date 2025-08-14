import { FaPen, FaStar } from "react-icons/fa6";
import type { IProduct } from "../../types/Product";
import Image from "../Images/Image";
import Button from "../Buttons/Button";
import { BsTrash3Fill } from "react-icons/bs";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import toast from "react-hot-toast";
import { deleteProduct } from "../../services/productService";
import { Link } from "react-router-dom";

export const ProductItem = ({
  product,
  onDelete,
}: {
  product: IProduct;
  onDelete: (productId: string) => void;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDeleteProduct = async () => {
    setIsLoading(true);
    try {
      await deleteProduct(product._id);
      setDeleteModal(false);
      toast.success("Delete product seccess");
      onDelete(product._id);
    } catch (error: any) {
      console.log("Error Delete : ", error);
      toast.error(error?.response?.data?.message || "Delete product failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid bg-warm-gray lg:grid-cols-12 items-center gap-4 text-off-white text-sm p-2 mb-2 tracking-wide">
      <div className="col-span-4 flex gap-3 items-center">
        <div className="w-16 h-16 bg-white rounded-sm">
          <Image
            src={product.images[0]}
            alt={product.name}
            fromServer={true}
            styles="w-full h-full rounded-sm object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-1"> {product.name} </p>
          <p className="text-xs font-light text-cold-gray/70 uppercase">
            {" "}
            {typeof product.brand !== "string"
              ? product.brand?.name
              : "unkown"}{" "}
          </p>
        </div>
      </div>
      <div className="col-span-1">{product.cost} DA</div>
      <div className="col-span-1">
        {" "}
        <p className="font-semibold">{product.price} DA</p>{" "}
        {product.oldPrice && (
          <p className=" line-through text-cold-gray/70 font-light mt-1">
            {product.oldPrice} DA
          </p>
        )}
      </div>
      <div className="col-span-1 text-center">{product.stock}</div>
      <div className="col-span-1">1000</div>
      <div className="col-span-1 flex items-center gap-1">
        {product.rating} <FaStar className="text-lg text-yellow-600" />{" "}
      </div>
      <div className="col-span-1 text-center">
        <span
          className={`p-1.5 font-semibold rounded-full text-sm ${
            product.isAvailable
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {" "}
          {product.isAvailable ? "Available" : "Not Available"}{" "}
        </span>
      </div>
      <div className="col-span-2 text-right flex justify-center items-center gap-2">
        <Button
          styles="!px-0 !py-0 !capitalize"
          content={
            <Link
              to={`edit-product/${product._id}`}
              className="flex gap-2 items-center !px-3 !py-2"
            >
              <FaPen />
              Edit
            </Link>
          }
        />
        <Button
          styles="!px-3 !py-2 !capitalize"
          variant="delete"
          action={() => setDeleteModal(true)}
          content={
            <>
              {" "}
              <BsTrash3Fill /> Delete{" "}
            </>
          }
        />
      </div>
      <ConfirmationModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone and will permanently remove the item from your account."
        type="delete"
        isLoading={isLoading}
      />
    </div>
  );
};
