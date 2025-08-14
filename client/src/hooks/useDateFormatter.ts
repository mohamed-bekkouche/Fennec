import { useTranslation } from "react-i18next";

export const useDateFormatter = () => {
  const { i18n } = useTranslation();

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);

    if (i18n.language === "ar") {
      return date.toLocaleDateString("ar-DZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return { formatDate };
};
