import { Link } from "react-router-dom";
import ButtonColored from "../Buttons/ButtonColored";
import Image from "../Image";
import { useTranslation } from "react-i18next";
import { useMeta } from "../../hooks/useMeta";

const CustimizeSuit = () => {
  const { t } = useTranslation();
  const { categories } = useMeta();
  const suitCategory = categories.find((cat) => cat.name === "suit");
  return (
    <div className="py-10 flex h-[70vh] md:h-dvh w-full relative">
      <Image
        src="/images/suits/background1.png"
        alt="background"
        styles=" absolute left-0 top-0 w-full h-full"
      />
      <div className="absolute bg-black/20 left-0 top-0 w-full h-full object-cover" />
      <div className="container flex justify-center ltr:justify-end rtl:justify-start relative z-10 items-center">
        <div className="w-full max-w-[600px] backdrop:blur-3xl p-2 lg:p-5 rounded-lg ">
          <p className="text-center text-cold-gray/80 text-[0.9rem] md:text-[1rem] tracking-wide lg:text-lg font-semibold uppercase mb-2 md:mb-4 font-the-seasons">
            {t("home.customizeSuit.subTitle")}
          </p>
          <h2 className="text-center text-off-white text-[1.75rem] md:text-3xl lg:text-5xl -mt-2 mb-5 font-black uppercase font-the-seasons">
            {t("home.customizeSuit.title")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2.5 px-6 mt-5">
            <ButtonColored
              styles="flex-1 !py-0 !px-0"
              variant="secondary"
              content={
                <Link
                  className="py-2 px-5 lg:py-3.5 lg:px-10 ml-auto mr-0 w-full"
                  to={
                    suitCategory
                      ? `/products?category=${suitCategory?._id}`
                      : "/products"
                  }
                >
                  {t("home.customizeSuit.ctaCollection")}
                </Link>
              }
            />
            <ButtonColored
              styles="flex-1 !py-0 !px-0"
              variant="cta"
              content={
                <Link
                  className="py-2 px-5 lg:py-3.5 lg:px-10 ml-auto mr-0 w-full"
                  to="/customize/personalize"
                >
                  {t("home.customizeSuit.ctaCustomize")}
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustimizeSuit;
