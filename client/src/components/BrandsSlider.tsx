import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "./Image";
import { useMeta } from "../hooks/useMeta";

const BrandsSlider = () => {
  const { brands } = useMeta();

  const controls = useAnimation();
  const sliderRef = useRef(null);
  const isInView = useInView(sliderRef, { once: false, margin: "0px" });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isInView && !isHovered) {
      controls.start({
        x: "-50%",
        transition: {
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isInView, isHovered, controls]);

  return (
    <div
      ref={sliderRef}
      className="w-full overflow-hidden py-2x md:py-5 lg:py-10 bg-off-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div animate={controls} className="flex w-max gap-20">
        {brands.map((brand) => (
          <div className="w-20 md:w-32 lg:w-40 shrink-0" key={brand._id}>
            <Image
              styles="h-full object-contain"
              src={brand.image}
              alt={brand.name}
              fromServer
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrandsSlider;
