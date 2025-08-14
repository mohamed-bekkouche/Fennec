import { useEffect, useState } from "react";
import ImageWear from "./ImageWear";
import SectionHeader from "./SectionHeader";
import { useTranslation } from "react-i18next";
import type { IProduct } from "../types/Product";
import type { IProductImage } from "../types/ProductImage";
import { getAllProductImages } from "../services/productImageService";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ClickToWear = () => {
  const { t } = useTranslation();
  const [productImages, setProductImages] = useState<IProductImage[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);

  const fetchProductImages = async () => {
    try {
      const {
        data: { productImages },
      } = await getAllProductImages();
      setProductImages(productImages);
    } catch (error) {
      console.log("Failed to fetch product images");
    }
  };

  useEffect(() => {
    fetchProductImages();
  }, []);
  return (
    <div className="min-h-screen bg-off-white ">
      <div className="w-11/12 max-w-6xl mx-auto flex-col md:flex-row flex items-stretch relative ">
        <div className="md:relative flex max-md:mx-auto w-full  md:w-2/3 flex-col items-center">
          {productImages.map((productImage) => (
            <ImageWear
              setProduct={setProduct}
              productImage={productImage}
              key={productImage._id}
            />
          ))}
        </div>
        <div className="-order-1 z-50 md:order-3 sticky top-0 md:relative max-md:h-fit max-md:py-3 max-md:flex max-md:justify-center max-md:items-center  w-full md:w-fit pt-2  bg-off-white">
          <div className="sticky top-0 md:h-screen flex flex-col justify-center md:pl-10  items-center">
            <div className="text-center text-nowrap mb-3">
              <SectionHeader
                title={t("home.clickToWear.title")}
                subTitle={t("home.clickToWear.subTitle")}
              />
            </div>
            <AnimatePresence>
              {product && (
                <motion.div
                  variants={{
                    initial: {
                      opacity: 0,
                      translateY: 30,
                    },
                    animate: {
                      opacity: 1,
                      translateY: 0,
                    },
                  }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  initial="initial"
                  animate={product ? "animate" : "initial"}
                  exit="initial"
                  className="w-[200px] md:w-[300px]"
                >
                  <ProductCard product={product} />
                </motion.div>
              )}{" "}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickToWear;
