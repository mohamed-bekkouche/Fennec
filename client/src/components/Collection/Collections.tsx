import { useTranslation } from "react-i18next";
import Collection from "./Collection";
import CollectionHeader from "./CollectionHeader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTopSellingProducts } from "../../services/productService";
import type { IProduct } from "../../types/Product";

const Collections = () => {
  const { t } = useTranslation();
  const [porducts, setPorducts] = useState<IProduct[]>([]);
  const fetchCollections = async () => {
    try {
      const {
        data: { topSellingProducts },
      } = await getTopSellingProducts({
        limit: 8,
      });
      setPorducts(topSellingProducts);
    } catch (error) {
      toast.error(t("components.errors.fetchCollections"));
    }
  };
  useEffect(() => {
    fetchCollections();
  }, []);
  return (
    <div className="w-full bg-cold-gray py-10">
      <div className="container">
        <CollectionHeader link="/" title={t("home.collections.topselling")} />
        <Collection styles="lg:grid-cols-4" collection={porducts} />
      </div>
    </div>
  );
};

export default Collections;
