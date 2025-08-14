import { NavLink, Outlet } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import SuitPreview from "./SuitPreview";
import { getSuitElements } from "../../services/suitElementService";
import { useEffect, useState } from "react";
import type { ISuitElement } from "../../stores/suitStore";
import suitStore from "../../stores/suitStore";
import { useTranslation } from "react-i18next";

const CustomizeSuit = () => {
  const { t } = useTranslation();
  const { jacket, pants, shoes, shirt, setSuit } = suitStore();
  const [suitElements, setSuitElements] = useState<{
    jacket: ISuitElement[];
    pants: ISuitElement[];
    vest: ISuitElement[];
    accessory: ISuitElement[];
    shoes: ISuitElement[];
    tie: ISuitElement[];
    shirt: ISuitElement[];
    belt: ISuitElement[];
  }>({
    jacket: [],
    pants: [],
    vest: [],
    accessory: [],
    shoes: [],
    tie: [],
    shirt: [],
    belt: [],
  });

  const fetchSuitElements = async () => {
    try {
      const { data } = await getSuitElements();

      setSuitElements(data.suitElements);
      setSuit({
        jacket: jacket || suitElements.jacket[0],
        pants: pants || suitElements.pants[0],
        shirt: shirt || suitElements.shirt[0],
        shoes: shoes || suitElements.shoes[0],
      });
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  useEffect(() => {
    fetchSuitElements();
  }, []);
  return (
    <div className="w-full py-5 md:py-10">
      <div className="px-3">
        <SectionHeader
          title={t("suits.customize.title")}
          subTitle={t("suits.customize.subTitle")}
        />
      </div>
      <div className="bg-cold-gray text-[0.725rem] md:text-sm uppercase font-light flex items-center justify-center gap-3 md:gap-6 px-1 py-5">
        <button className=" has-[.active]:font-bold uppercase tracking-wide">
          <NavLink to="personalize"> {t("suits.customize.personalize")} </NavLink>
        </button>
        <button className=" has-[.active]:font-bold uppercase tracking-wide">
          <NavLink to="customize"> {t("suits.customize.customize")} </NavLink>
        </button>
        <button className=" has-[.active]:font-bold uppercase tracking-wide">
          <NavLink to="accessories"> {t("suits.customize.accessories")} </NavLink>
        </button>
        <button className=" has-[.active]:font-bold uppercase tracking-wide">
          <NavLink to="overview"> {t("suits.customize.overview")} </NavLink>
        </button>
      </div>
      <div className="container h-fit md:h-dvh flex items-start py-5 md:py-10 flex-wrap relative">
        <SuitPreview />
        <div className=" w-full h-fit md:w-1/2 md:h-full ">
          <Outlet context={suitElements} />
        </div>
      </div>
    </div>
  );
};

export default CustomizeSuit;
