import { useTranslation } from "react-i18next";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { testConnection } from "./services/metaService";

const App = () => {
  const { i18n } = useTranslation();
  const fetchContection = async () => {
    try {
      const response = await testConnection();
      console.log("Connection test:", response);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };
  useEffect(() => {
    fetchContection();
  }, []);
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
