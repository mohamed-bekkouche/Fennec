import { motion } from "framer-motion";
import LabelBubble from "../LabelBubble.tsx";
import { Link } from "react-router-dom";
import Image from "../Image.tsx";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import useDirection from "../../hooks/useDirection.ts";
interface ICollection {
  _id: string;
  name: string;
  image: string;
}
const Hero = () => {
  const { t } = useTranslation();
  const direction = useDirection();
  const collections: ICollection[] = [
    {
      _id: "1",
      name: "Nike Moca 2022",
      image: "/images/hero/1.webp",
    },

    {
      _id: "3",
      name: "Nike Moca 2023",
      image: "/images/hero/2.webp",
    },
    {
      _id: "4",
      name: "Nike Moca 2022",
      image: "/images/hero/3.webp",
    },
    {
      _id: "2",
      name: "Nike Moca 2023",
      image: "/images/hero/4.webp",
    },
    {
      _id: "5",
      name: "Nike Moca 2022",
      image: "/images/hero/5.avif",
    },
  ];
  return (
    <>
      <section className="min-h-[calc(100dvh-48px)] container pb-10 pt-5 md:py-10 overflow-hidden bg-off-white">
        <Helmet>
          <link
            rel="preload"
            fetchPriority="high"
            as="image"
            href="/images/hero/1.webp"
            type="image/webp"
          />
          <link
            rel="preload"
            fetchPriority="high"
            as="image"
            href="/images/hero/2.webp"
            type="image/webp"
          />
          <link
            rel="preload"
            fetchPriority="high"
            as="image"
            href="/images/hero/3.webp"
            type="image/webp"
          />
          <link
            rel="preload"
            fetchPriority="high"
            as="image"
            href="/images/hero/4.webp"
            type="image/webp"
          />
          <link
            rel="preload"
            fetchPriority="high"
            as="image"
            href="/images/hero/5.avif"
            type="image/avif"
          />
        </Helmet>
        <h1 className="text-center h-fit text-off-black overflow-hidden relative mb-7 md:mb-10 font-the-seasons lg:pb-3">
          {" "}
          <motion.span
            initial={{ translateY: "128px" }}
            animate={{ translateY: "0px" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="block text-3xl md:text-4xl lg:text-5xl font-medium mb-1"
          >
            {t("home.hero.subTitle")}
          </motion.span>{" "}
          <motion.span
            initial={{ translateY: "128px" }}
            animate={{ translateY: "0px" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-4xl md:text-5xl lg:text-7xl block uppercase font-bold"
          >
            {t("home.hero.title")}
          </motion.span>{" "}
        </h1>
        <div className="hidden md:flex h-[260px] lg:h-[320px] xl:h-[400px] items-center justify-center w-full relative">
          {collections.map((collection, i) => (
            <motion.div
              key={collection._id}
              initial={{
                top: "500px",
                left: "50%",
                translateX: "-50%",
                position: "absolute",
              }}
              animate={{
                top: "0px",
                left: `${(100 / collections.length) * i}%`,
                translateX: "0%",
                translateY: `${Math.abs(
                  (Math.floor(collections.length / 2) - i) * 10
                )}px`,
                transition: {
                  top: {
                    duration: 0.6,
                    delay: 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 14,
                  },
                  left: {
                    duration: 0.8,
                    delay: 0.9,
                  },
                  translateX: {
                    duration: 0.8,
                    delay: 0.9,
                  },
                  translateY: {
                    duration: 0.8,
                    delay: 0.9,
                  },
                },
              }}
              style={{
                rotate: `${
                  Math.random() * 4.5 * (Math.random() < 0.5 ? -1 : 1)
                }deg`,
                zIndex: collections.length - i,
              }}
              className="md:w-[160px] lg:w-[220px] xl:w-[270px]  rounded-3xl overflow-hidden shadow-xl"
            >
              <div className=" absolute top-2 end-2 bg-off-white py-1 px-2 rounded-4xl text-off-black  text-xs">
                {collection.name}
              </div>
              <Image
                src={collection.image}
                alt={collection.name}
                styles="w-full h-full object-cover"
                fetchPriority="high"
                loading="lazy"
              />
            </motion.div>
          ))}
          <LabelBubble
            borderColor="border-t-primary"
            styles={`hidden sm:block -top-[100px] -end-2  ${
              direction === "rtl"
                ? "-rotate-[12deg] lg:rotate-[-6deg]"
                : "rotate-[12deg] lg:rotate-[6deg]"
            }  lg:-top-[70px] lg:end-8 bg-off-black text-white`}
            content={t("home.hero.bubble1")}
            animationDuration={0.3}
            animationDelay={0.9}
          />
          <LabelBubble
            borderColor="border-t-secondary"
            styles={`hidden sm:block -top-[100px] -start-2 ${
              direction === "rtl"
                ? "rotate-[12deg] lg:rotate-[6deg]"
                : "-rotate-[12deg] -g:rotate-[-6deg]"
            } lg:-top-[50px] lg:start-16  bg-secondary text-white`}
            content={t("home.hero.bubble2")}
            animationDuration={0.3}
            animationDelay={0.9}
          />
        </div>
        <div className="md:hidden overflow-x-auto mb-5">
          <div className="flex gap-5 w-max items-stretch">
            {collections.map((collection) => (
              <div
                className="w-[70vw]  sm:w-[50vw] h-full rounded-sm overflow-hidden"
                key={collection._id}
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  styles="h-full w-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{
            translateY: "300px",
          }}
          animate={{
            translateY: "0px",
            transition: {
              translateY: {
                duration: 0.8,
                delay: 0.9,
              },
            },
          }}
          className="text-center font-inter text-sm md:text-[1rem] mx-5 md:mx-0"
        >
          <p className="mb-5 md:mb-7 mx-auto text-[1rem] md:text-lg lg:text-xl leading-5 max-w-xl md:leading-5">
            {t("home.hero.paragraph")}
          </p>
          <button>
            <Link
              className="px-7 py-3  rounded-3xl bg-off-black text-off-white cursor-pointer"
              to="/"
            >
              {t("home.hero.cta")}
            </Link>
          </button>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
