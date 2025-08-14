import Button from "../Buttons/Button";
import Collection from "./Collection";
import SectionHeader from "../SectionHeader";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import toast from "react-hot-toast";

const SeasonCollection = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  const fetchPorudcts = async () => {
    try {
      const { data } = await getProducts({
        seasonCollection: "687de19da7f631aeb3b67dd0",
        limit: 8,
      });
      setProducts(data.products);
    } catch (error) {
      toast.error(t("components.errors.fetchProducts"));
    }
  };
  useEffect(() => {
    fetchPorudcts();
  }, []);
  return (
    <div className="min-h-screen bg-cold-gray py-5 md:py-10 max-sm:px-3">
      <div className="container">
        <SectionHeader
          title={t("home.seasonCollection.title")}
          subTitle={t("home.seasonCollection.subTitle")}
        />
        <Collection styles="xl:grid-cols-4" collection={products} />
        <Button
          styles="uppercase !font-light !mx-auto sm:!w-fit"
          content={t("home.seasonCollection.cta")}
        />
      </div>
    </div>
  );
};

export default SeasonCollection;
