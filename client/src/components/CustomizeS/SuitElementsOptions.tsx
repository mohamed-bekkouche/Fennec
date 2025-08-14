import { FaSlash } from "react-icons/fa6";
import type { ISuitElement } from "../../stores/suitStore";
import Image from "../Image";
import suitStore from "../../stores/suitStore";
import { useTranslation } from "react-i18next";

const SuitElementsOptions = ({
  title,
  currentItem,
  options,
  type,
}: {
  title: string;
  currentItem: ISuitElement | null;
  options: ISuitElement[];
  type:
  | "jacket"
  | "pants"
  | "vest"
  | "shoes"
  | "tie"
  | "shirt"
  | "belt"
  | "accessory";
}) => {
  const { t } = useTranslation();
  const { setSuit } = suitStore();
  return (
    <div className="mb-3.5 md:mb-5 p-2 md:p-3 border-b border-warm-gray/20">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 flex items-center gap-3">
        {title} :{" "}
        <span className="text-sm md:text-lg text-warm-gray/70 font-normal">
          {currentItem?.color.name || t("components.suitElements.nothing")}
        </span>
      </h3>
      <div className="border-t border-gray-100 pt-2">
        <h4 className="text-[0.7rem] md:text-xs font-semibold text-green-600 mb-2 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
          {t("components.suitElements.availableOptions")}
        </h4>

        <div className="flex flex-wrap gap-1 md:gap-2">
          {type !== "pants" && (
            <button
              onClick={() => setSuit({ [type]: null })}
              className={`group relative p-1 md:p-1.5 cursor-pointer w-11 h-11 md:w-14 md:h-14 rounded-full border-2 transition-all duration-200 ${currentItem === null
                  ? "border-warm-gray/80 opacity-100 shadow-md"
                  : "border-warm-gray/10 opacity-90 hover:border-warm-gray/20 hover:shadow-xs hover:opacity-100"
                }`}
              aria-label={t("components.suitElements.selectNothing")}
            >
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FaSlash size={16} />
              </div>
            </button>
          )}

          {options.map((option) => (
            <button
              key={option._id}
              onClick={() => setSuit({ [type]: option })}
              className={`group relative p-1 md:p-1.5 cursor-pointer w-11 h-11 md:w-14 md:h-14 rounded-full border-2 transition-all duration-200 ${currentItem?._id === option._id
                  ? "border-warm-gray/80 opacity-100 shadow-md ring-2 ring-warm-gray/20"
                  : "border-warm-gray/10 opacity-90 hover:border-warm-gray/20 hover:shadow-xs hover:opacity-100"
                }`}
              aria-label={`Select ${option.color.name}`}
            >
              <Image
                styles="w-full h-full object-cover rounded-full"
                src={option.image}
                alt={option.product.name}
                fromServer
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuitElementsOptions;
