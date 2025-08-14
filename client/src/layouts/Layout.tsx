import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import { useEffect, type ReactNode } from "react";
import Footer from "./Footer";
import toast from "react-hot-toast";
import {
  getAllBrands,
  getAllCategories,
  getAllCollections,
} from "../services/metaService";
import { useMeta } from "../hooks/useMeta";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const shouldShowLayouts =
    !location.pathname.startsWith("/auth") &&
    !location.pathname.startsWith("/chec");

  const { setMeta } = useMeta();

  const fetchMeta = async () => {
    try {
      const [
        {
          data: { categories },
        },
        {
          data: { brands },
        },
        {
          data: { collections },
        },
      ] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
        getAllCollections(),
      ]);
      setMeta({ categories, brands, collections });
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);
  return (
    <>
      {shouldShowLayouts && <NavBar />}
      <>{children}</>
      {shouldShowLayouts && <Footer />}
    </>
  );
};

export default Layout;
