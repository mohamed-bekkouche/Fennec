import { useState } from "react";
import Button from "./Buttons/Button";
import Image from "./Image";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../types/Product";

interface IProductWearCardProps {
  product: IProduct;
}

const ProductWearCard = ({ product }: IProductWearCardProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="w-[200px] md:w-[300px] -mt-5">
      <div className="w-[170px] md:w-full overflow-hidden h-[170px] md:h-[300px] mb-1 mx-auto md:mb-3">
        {" "}
        <Image fromServer src={product.images[currentIndex]} alt="cloth" />
      </div>{" "}
      <p className=" text-center text-sm md:text-lg font-normal">
        {" "}
        {product.name}{" "}
      </p>
      <p className=" text-center text-xs md:text-sm font-light mb-1 md:mb-3">
        {" "}
        <span> {product.price}$ </span>{" "}
        {product.oldPrice && (
          <span className="line-through"> {product.oldPrice}$ </span>
        )}
      </p>
      <Button
        styles="bg-off-black !uppercase !font-light border-off-black hover:text-off-black !w-4/5 mx-auto !rounded-none"
        content={t("components.clothCard.cta")}
      />
      <div className="justify-center mt-3 gap-1 w-full hidden md:flex">
        {" "}
        {product.images?.map((_, i) => (
          <span
            onClick={() => setCurrentIndex(i)}
            className={`block rounded-full h-2.5 duration-100 ${i === currentIndex
              ? "w-4 bg-off-black"
              : "w-2.5 bg-gray-400 cursor-pointer"
              }`}
          />
        ))}{" "}
      </div>
    </div>
  );
};

export default ProductWearCard;
