import { useTranslation } from "react-i18next";

export const useFormatCurrency = () => {
  const { i18n } = useTranslation();

  const formatCurrency = (price: number) => {
    if (i18n.language === "ar") {
      return `${price.toLocaleString("ar-DZ")} دج`;
    }
    return `${price.toLocaleString("ar-DZ")} DA`;
  };

  return { formatCurrency };
};
