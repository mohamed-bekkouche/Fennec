

import Button from "../Buttons/Button";
import { motion } from "framer-motion";
import Image from "../Image";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../../types/Product";

import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { FaHeart } from "react-icons/fa6";
import { addProduct } from "../../hooks/useCart";

interface IProductCardProps {
    product: IProduct;
}
const ProductCard = ({ product }: IProductCardProps) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const addProductToCart = () => {
        console.log("Add Product :")
        addProduct(
            product,
            product.colors[0],
            typeof product.sizes === "string" ? product.sizes : product.sizes[0],
            1
        );
        toast.success("Product Added Successfully To Cart");
    };

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 10 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, amount: 0.7 }}
            className="w-full bg-transparent"
            key={product._id}
        >
            <div className="relative overflow-hidden flex-1 mb-3 group aspect-square">
                {product.oldPrice && (
                    <div className="absolute top-2 start-2 z-10 w-fit p-1.5 text-xs uppercase tracking-widest bg-off-black text-off-white text-center">
                        {Math.floor((1 - product.price / product.oldPrice) * 100)}%{" "}
                        {t("components.clothCard.discount")}
                    </div>
                )}

                <div className="z-10 absolute  top-2 end-2 rounded-full cursor-pointer text-[1.75rem]">
                    {user?.wishList?.includes(product._id) ? (
                        <FaHeart className=" text-black" />
                    ) : (
                        <FaHeart className="text-off-black/50 hover:text-off-black duration-200" />
                    )}
                </div>

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

            <p className="uppercase text-sm font-medium text-center">
                {product.name}
            </p>

            <div className="flex justify-center gap-2 text-sm font-light mb-2">
                <span>{product.price} $</span>
                {product.oldPrice && (
                    <span className="line-through text-red-600">
                        {product.oldPrice} $
                    </span>
                )}
            </div>
            <Button
                styles="!rounded-none bg-off-black border-off-black hover:text-off-black !uppercase !text-light !text-sm"
                action={() => addProductToCart()}
                content={t("components.clothCard.cta")}
            />
        </motion.div>
    );
};

export default ProductCard;
