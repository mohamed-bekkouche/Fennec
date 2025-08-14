import { Link, useOutletContext } from "react-router-dom";
import type { ISuitElement } from "../../stores/suitStore";
import suitStore from "../../stores/suitStore";
import { FaArrowRight } from "react-icons/fa6";
import ButtonColored from "../../components/Buttons/ButtonColored";
import SuitElementsOptions from "../../components/CustomizeS/SuitElementsOptions";
import { useTranslation } from "react-i18next";

const Suit = () => {
  const { t } = useTranslation();
  const { jacket, pants, vest } = suitStore();
  const {
    jacket: jacketsOptions,
    pants: pantsOptions,
    vest: vestOptions,
  }: {
    jacket: ISuitElement[];
    pants: ISuitElement[];
    vest: ISuitElement[];
  } = useOutletContext();

  return (
    <div className="h-full px-5 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <SuitElementsOptions
          title={t("suits.suitCustomize.jacket")}
          currentItem={jacket}
          options={jacketsOptions}
          type="jacket"
        />
        <SuitElementsOptions
          title={t("suits.suitCustomize.vest")}
          currentItem={vest}
          options={vestOptions}
          type="vest"
        />
        <SuitElementsOptions
          title={t("suits.suitCustomize.pants")}
          currentItem={pants}
          options={pantsOptions}
          type="pants"
        />
      </div>
      <div className="flex items-center gap-2 justify-end py-2">
        <ButtonColored
          styles="!py-0 !px-0"
          content={
            <Link
              className="flex text-xs md:text-sm items-center gap-1.5 py-2.5 px-4 md:py-3.5 md:px-8 "
              to="/customize/customize"
            >
              {t("suits.accessories.continue")} <FaArrowRight size={16} />{" "}
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default Suit;
