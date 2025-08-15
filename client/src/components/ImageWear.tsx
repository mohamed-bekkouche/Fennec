import { type Dispatch, type SetStateAction } from "react";
import HotSpot from "./HotSpot";
import Image from "./Image";
import type { IProduct } from "../types/Product";
import type { IProductImage } from "../types/ProductImage";

interface IImageWearProps {
  productImage: IProductImage;
  setProduct: Dispatch<SetStateAction<IProduct | null>>;
}
const ImageWear = ({ productImage, setProduct }: IImageWearProps) => {
  const getProductSpot = (i: string) => {
    const hotspot = productImage.hotspots.find((h) => h.product._id === i);
    const product: IProduct | null = hotspot?.product || null;
    setProduct(product);
  };

  return (
    <div className="h-[65dvh] md:h-screen py-5 md:py-10 max-md:px-5">
      <div className="h-full relative">
        {productImage.hotspots.map((hotSpot, key) => (
          <HotSpot
            key={key}
            action={getProductSpot}
            id={hotSpot.product._id}
            top={hotSpot.positionY}
            left={hotSpot.positionX}
          />
        ))}
        <Image
          styles="h-full w-full relative"
          src={productImage.image}
          fromServer
          alt="male model"
        />
      </div>
    </div>
  );
};

export default ImageWear;
