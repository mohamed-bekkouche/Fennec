import { useTranslation } from "react-i18next";

const useDirection = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  return direction;
};
export default useDirection;
