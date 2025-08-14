import Button from "./Buttons/Button";
import { motion } from "framer-motion";
import Image from "./Image";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../types/Product";
import { addProduct } from "../hooks/useCart";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { FaHeart } from "react-icons/fa6";
import { addToWishlist, removeFromWishlist } from "../services/productService";
import { Link } from "react-router-dom";
import { useFormatCurrency } from "../hooks/useFormatCurrency";

interface IProductCardProps {
  product: IProduct;
  index?: number;
}
const ProductCard = ({ product, index }: IProductCardProps) => {
  const { user, setProfile } = useAuth();
  const { formatCurrency } = useFormatCurrency();
  const { t } = useTranslation();
  const addProductToCart = () => {
    addProduct(
      product,
      product.colors[0],
      typeof product.sizes === "string" ? product.sizes : product.sizes[0],
      1
    );
    toast.success("Product Added Successfully To Cart");
  };

  const handleWishlist = async (productId: string) => {
    try {
      if (!user) {
        toast.error("Please login to manage your wishlist");
        return;
      }

      if (user.wishList?.includes(productId)) {
        await removeFromWishlist(productId);
        setProfile({
          ...user,
          wishList: user.wishList.filter((id) => id !== productId),
        });
        toast.success("Product removed from wishlist");
      } else {
        await addToWishlist(productId);
        setProfile({
          ...user,
          wishList: [...(user.wishList || []), productId],
        });
        toast.success("Product added to wishlist");
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update wishlist"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      whileInView={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.1 }}
      viewport={{ once: true, amount: 0.5 }}
      className="w-full bg-transparent"
      key={product._id}
    >
      <div className="relative overflow-hidden flex-1 mb-1 md:mb-3 group aspect-square">
        {product.oldPrice && (
          <div className="absolute top-2 start-2 z-10 w-fit p-1.5 text-xs uppercase tracking-widest bg-off-black text-off-white text-center">
            {Math.floor((1 - product.price / product.oldPrice) * 100)}%{" "}
            {t("components.clothCard.discount")}
          </div>
        )}

        <button
          onClick={() => handleWishlist(product._id)}
          className="z-10 absolute  top-2 end-2 rounded-full cursor-pointer text-[1.75rem] p-0"
        >
          {user?.wishList?.includes(product._id) ? (
            <FaHeart className=" text-black" />
          ) : (
            <FaHeart className="text-off-black/50 hover:text-off-black duration-200" />
          )}
        </button>

        <div className="w-full h-full relative">
          <Image
            styles="absolute inset-0 w-full h-full object-cover transition-opacity delay-50 duration-300 group-hover:opacity-0"
            src={product?.images[0]}
            alt={product.name}
            fromServer={true}
          />
          <Image
            styles="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            src={product?.images[1]}
            alt={product.name}
            fromServer={true}
          />
        </div>
      </div>

      <button>
        <Link
          to={`/products/${product._id}`}
          className="uppercase text-sm font-semibold text-center"
        >
          {product.name}
        </Link>
      </button>

      <div className="flex justify-center gap-2 md:text-sm  mb-1">
        <span>{formatCurrency(product.price)}</span>
        {product.oldPrice && (
          <span className="line-through text-red-600">
            {formatCurrency(product.oldPrice)}
          </span>
        )}
      </div>
      <Button
        styles="!py-2 !text-sm"
        action={() => addProductToCart()}
        content={t("components.clothCard.cta")}
      />
    </motion.div>
  );
};

export default ProductCard;
