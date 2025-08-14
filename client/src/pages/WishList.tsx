import { useEffect, useRef, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import type { IProduct } from "../types/Product";
import ProductCard from "../components/ProductCard";
import { getUserWishlist } from "../services/productService";
import Pagination from "../components/Pagination";
import { useTranslation } from "react-i18next";

const WishList = () => {
  const { t } = useTranslation();
  const wishListRef = useRef<HTMLDivElement>(null);
  const [wishListProducts, setWishListProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);

  const handlePageChange = (newPage: number) => {
    wishListRef.current?.scrollIntoView({ behavior: "smooth" });
    setCurrentPage(newPage);
  };

  const fetchWishListProducts = async () => {
    try {
      const {
        data: { wishList, totalPages },
      } = await getUserWishlist({ page: currentPage });
      setWishListProducts(wishList);
      setPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchWishListProducts();
  }, [currentPage]);

  return (
    <div ref={wishListRef} className="">
      <SectionHeader
        title={t("wishList.title")}
        subTitle={t("wishList.subTitle")}
      />
      <div className="grid bg-cold-gray p-4 gap-4 rounded-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishListProducts.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default WishList;
