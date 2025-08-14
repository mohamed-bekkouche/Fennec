import { useTranslation } from "react-i18next";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { i18n } = useTranslation();
  return (
    <div
      lang={i18n.language}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen relative"
    >
      <AppRoutes />
    </div>
  );
};

export default App;
