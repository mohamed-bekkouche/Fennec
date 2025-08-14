import { motion, MotionValue } from "framer-motion";
import Image from "./Image";

interface IImageColumn {
  images: string[];
  y: MotionValue<number>;
}
const ImageColumn = ({ images, y }: IImageColumn) => {
  return (
    <motion.div
      style={{ y }}
      className="will-change-transform flex relative flex-col flex-1 gap-3 imageColumn first-of-type:top-[-13%] md:first-of-type:top-[-45%] nth-of-type-[2]:top-[-20%] md:nth-of-type-[2]:top-[-85%] nth-of-type-[3]:top-[-45%] last-of-type:top-[-75%]"
    >
      {images.map((img, i) => (
        <div className="flex-1 rounded-lg overflow-hidden" key={i}>
          <Image
            src={img}
            alt="male model"
            styles="h-full w-full object-cover"
            fetchPriority="low"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default ImageColumn;
