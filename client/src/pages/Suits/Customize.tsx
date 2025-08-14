import { Link, useOutletContext } from "react-router-dom";
import type { ISuitElement } from "../../stores/suitStore";
import suitStore from "../../stores/suitStore";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ButtonColored from "../../components/Buttons/ButtonColored";
import SuitElementsOptions from "../../components/CustomizeS/SuitElementsOptions";
import { useTranslation } from "react-i18next";

const Customize = () => {
  const { t } = useTranslation();
  const { shoes, tie, shirt } = suitStore();
  const {
    shirt: shirtsOptions,
    tie: tiesOptions,
    shoes: shoesOptions,
  }: {
    shirt: ISuitElement[];
    tie: ISuitElement[];
    shoes: ISuitElement[];
  } = useOutletContext();

  return (
    <div className="h-full flex flex-col py-5">
      <div className="flex-1 overflow-y-auto">
        <SuitElementsOptions
          title={t("suits.suitCustomize.shirt")}
          currentItem={shirt}
          options={shirtsOptions}
          type="shirt"
        />
        <SuitElementsOptions
          title={t("suits.suitCustomize.tie")}
          currentItem={tie}
          options={tiesOptions}
          type="tie"
        />
        <SuitElementsOptions
          title={t("suits.suitCustomize.shoes")}
          currentItem={shoes}
          options={shoesOptions}
          type="shoes"
        />
      </div>
      <div className="flex items-center gap-3 justify-end pt-1 md:pt-3">
        <button>
          <Link
            className="flex text-xs md:text-sm items-center gap-1.5 uppercase py-2.5 px-2 md:py-3.5 md:px-8 font-bold text-blue-600 hover:text-blue-700 duration-200"
            to="/customize/personalize"
          >
            <FaArrowLeft size={14} /> {t("suits.suitCustomize.returnToPersonalize")}{" "}
          </Link>
        </button>
        <ButtonColored
          styles="!py-0 !px-0"
          content={
            <Link
              className="flex text-xs md:text-sm items-center gap-1.5 py-2.5 px-4 md:py-3.5 md:px-8 "
              to="/customize/accessories"
            >
              {t("suits.accessories.continue")} <FaArrowRight size={14} />{" "}
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default Customize;
