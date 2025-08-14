import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100dvh-277px)] w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-off-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-warm-gray mb-4">
          {t("notFound.title")}
        </h2>
        <p className="text-warm-gray/70 mb-8">
          {t("notFound.message")}
        </p>
        <Link
          to="/"
          className="bg-off-black text-white px-6 py-3 rounded-lg hover:bg-warm-gray transition-colors"
        >
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
