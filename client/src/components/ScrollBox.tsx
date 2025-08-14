import { useRef } from "react";
import ImageColumn from "./ImageColumn";
import { useScroll, useTransform, motion } from "framer-motion";
import useDimension from "../hooks/useDimensions";
import { useLenis } from "../hooks/useLenis";
import { useTranslation } from "react-i18next";

const ScrollBox = () => {
  const { t } = useTranslation();
  const images = [
    "/images/hero/1.webp",
    "/images/hero/2.webp",
    "/images/hero/3.webp",
    "/images/hero/4.webp",
    "/images/hero/5.avif",
    "/images/hero2/1.jpg",
    "/images/hero2/2.jpg",
    "/images/hero/3.webp",
    "/images/hero/4.webp",
    "/images/hero/5.avif",
    "/images/hero2/1.jpg",
    "/images/hero/2.webp",
  ];

  const scrollRef = useRef(null);
  const { height, width } = useDimension();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height * (width >= 768 ? 2 : 0.8)]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height * (width >= 768 ? 3.1 : 1)]
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height * (width >= 768 ? 1.9 : 0.6)]
  );
  const y4 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height * (width >= 768 ? 2.8 : 1)]
  );
  const yHeadder = useTransform(
    scrollYProgress,
    [0, 1],
    [0, height * (width >= 768 ? 1.8 : 1.4)]
  );

  useLenis();

  return (
    <div className="min-h-screen">
      <div className="overflow-hidden relative p-3 bg-off-black mt-10">
        <motion.div
          style={{ y: yHeadder }}
          className="absolute  md:-top-14 z-10 h-0 start-0 w-full will-change-transform"
        >
          <p className="text-center text-lg md:text-xl lg:text-3xl font-normal text-off-white uppercase mb-4 font-the-seasons  drop-shadow-[2px_2px_1px_black]">
            {t("home.scrollBox.subTitle")}
          </p>
          <h2 className="text-center text-off-white text-[1.75rem] sm:text-4xl md:text-5xl lg:text-7xl -mt-2 mb-5 font-bold uppercase font-the-seasons drop-shadow-[3px_3px_1px_black]">
            {t("home.scrollBox.title")}
          </h2>
        </motion.div>

        <div
          ref={scrollRef}
          className="h-[175dvh] md:text-white flex gap-3 overflow-hidden"
        >
          {width >= 768 && (
            <>
              <ImageColumn y={y1} images={[images[0], images[1], images[2]]} />
              <ImageColumn y={y2} images={[images[3], images[4], images[5]]} />
            </>
          )}

          <ImageColumn y={y3} images={[images[6], images[7], images[8]]} />
          <ImageColumn y={y4} images={[images[9], images[10], images[11]]} />
        </div>
      </div>
    </div>
  );
};

export default ScrollBox;
