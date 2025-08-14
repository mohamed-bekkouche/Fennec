import React, { useState, useEffect, useRef } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import type { IProduct } from "../../types/Product";
import { useMeta } from "../../hooks/useMeta";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import InputField from "../../components/Inputs/InputField";
import SelectField from "../../components/Inputs/SelectField";
import { AnimatePresence, motion } from "framer-motion";
import useDimension from "../../hooks/useDimensions";
import Pagination from "../../components/Pagination";
import ButtonColored from "../../components/Buttons/ButtonColored";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

interface IFilters {
  category: string;
  brand: string;
  seasonCollection: string;
  minPrice: string;
  maxPrice: string;
  name: string;
  sortBy: string;
  order: "asc" | "desc";
}

const Products: React.FC = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "products.products.list",
  });
  const [searchParams] = useSearchParams();

  const { categories, brands, collections } = useMeta();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const { register, watch, reset, setValue } = useForm<IFilters>({
    defaultValues: {
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      seasonCollection: searchParams.get("seasonCollection") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      name: searchParams.get("name") || "",
      sortBy: searchParams.get("sortBy") || "name",
      order: searchParams.get("order") === "desc" ? "desc" : "asc",
    },
  });
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const { width } = useDimension();

  const filterValues = watch();

  const clearFilters = () => {
    reset({
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      seasonCollection: searchParams.get("seasonCollection") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      name: searchParams.get("name") || "",
      sortBy: searchParams.get("sortBy") || "name",
      order: searchParams.get("order") === "desc" ? "desc" : "asc",
    });
    setPage(1);
  };

  const getActiveFilters = () => {
    const active: { key: keyof IFilters; label: string }[] = [];
    if (filterValues.name) {
      active.push({
        key: "name",
        label: t("activeChip.search", { q: filterValues.name }),
      });
    }
    if (filterValues.category) {
      const categoryName =
        categories.find((c) => c._id === filterValues.category)?.name ||
        filterValues.category;
      active.push({
        key: "category",
        label: t("activeChip.category", { name: categoryName }),
      });
    }
    if (filterValues.brand) {
      const brandName =
        brands.find((b) => b._id === filterValues.brand)?.name ||
        filterValues.brand;
      active.push({
        key: "brand",
        label: t("activeChip.brand", { name: brandName }),
      });
    }
    if (filterValues.seasonCollection) {
      const collectionName =
        collections.find((c) => c._id === filterValues.seasonCollection)
          ?.name || filterValues.seasonCollection;
      active.push({
        key: "seasonCollection",
        label: t("activeChip.collection", { name: collectionName }),
      });
    }
    if (filterValues.minPrice)
      active.push({
        key: "minPrice",
        label: t("activeChip.min", { value: filterValues.minPrice }),
      });
    if (filterValues.maxPrice)
      active.push({
        key: "maxPrice",
        label: t("activeChip.max", { value: filterValues.maxPrice }),
      });
    return active;
  };
  const activeFilters = getActiveFilters();

  const removeFilter = (filterKey: keyof IFilters) => {
    setValue(filterKey, "");
    setPage(1);
  };

  const fetchProduct = async () => {
    try {
      const {
        data: { products, pages },
      } = await getProducts({
        ...filterValues,
        page,
        limit: 30,
      });
      setProducts(products);
      setTotalPages(pages);
    } catch (error) {
      toast.error(t("toasts.fetchFailed"));
    }
  };

  const handlePageChange = (newPage: number) => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setPage(newPage);
  };

  useEffect(() => {
    fetchProduct();
  }, [filterValues, page]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [
    filterValues.category,
    filterValues.brand,
    filterValues.seasonCollection,
    filterValues.minPrice,
    filterValues.maxPrice,
    filterValues.name,
    filterValues.sortBy,
    filterValues.order,
  ]);

  return (
    <div ref={topRef} className="h-fit bg-cold-gray flex relative">
      {/* Filters Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            /* ...motion props... */ className="overflow-hidden backdrop-blur-sm border-r border-warm-gray/10 bg-off-white h-dvh sticky top-0 pt-10 flex-shrink-0"
          >
            <div className="w-[250px] lg:w-[350px] h-full overflow-y-auto">
              <div className="p-3 lg:p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("filters.title")}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("filters.subtitle")}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <InputField
                      placeholder={t("filters.searchPlaceholder")}
                      label={t("filters.searchLabel")}
                      register={register}
                      type="search"
                      name="name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <SelectField
                      name="category"
                      label={t("filters.category")}
                      options={categories}
                      register={register}
                      noValue={t("filters.allCategories")}
                    />
                    <SelectField
                      name="brand"
                      label={t("filters.brand")}
                      options={brands}
                      register={register}
                      noValue={t("filters.allBrands")}
                    />
                    <SelectField
                      name="seasonCollection"
                      label={t("filters.collection")}
                      options={collections}
                      register={register}
                      noValue={t("filters.allCollections")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t("filters.priceRange")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        type="number"
                        register={register}
                        name="minPrice"
                        placeholder={t("filters.minPrice")}
                      />
                      <InputField
                        type="number"
                        register={register}
                        name="maxPrice"
                        placeholder={t("filters.maxPrice")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SelectField
                      name="sortBy"
                      label={t("filters.sortBy")}
                      options={[
                        {
                          _id: "createdAt",
                          name: t("filters.sortOptions.createdAt"),
                        },
                        { _id: "name", name: t("filters.sortOptions.name") },
                        { _id: "price", name: t("filters.sortOptions.price") },
                        { _id: "brand", name: t("filters.sortOptions.brand") },
                        {
                          _id: "category",
                          name: t("filters.sortOptions.category"),
                        },
                      ]}
                      register={register}
                    />
                    <SelectField
                      name="order"
                      label={t("filters.order")}
                      options={[
                        { _id: "asc", name: t("filters.orderOptions.asc") },
                        { _id: "desc", name: t("filters.orderOptions.desc") },
                      ]}
                      register={register}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 container overflow-x-hidden flex flex-col">
        <div className="flex-1 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-wrap gap-2">
              {/* toggle button unchanged, just icons */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3.5 cursor-pointer rounded-full shadow-md transition-all duration-200 ${
                  showFilters
                    ? "bg-off-black hover:bg-off-black/90 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                }`}
              >
                {showFilters ? <FiX size={24} /> : <FiFilter size={24} />}
              </button>

              {activeFilters.map((filter) => (
                <div
                  key={filter.key}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key)}
                    className="ml-2 hover:bg-blue-200 rounded-full p-1 transition-colors"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer transition-colors"
            >
              {t("clearAll")}
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="rounded-2xl p-12 max-w-md mx-auto">
                <div className="text-warm-gray/60 mb-6">
                  <FiSearch size={100} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t("empty.title")}</h3>
                <p className="text-warm-gray/60 mb-8 leading-relaxed">
                  {t("empty.subtitle")}
                </p>
                <ButtonColored
                  styles="mx-auto py-3"
                  variant="delete"
                  content={t("empty.cta")}
                  action={clearFilters}
                />
              </div>
            </div>
          ) : (
            // product grid unchanged
            <div className="grid pb-5 gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  index={
                    width >= 1536
                      ? i % 5
                      : width >= 1280
                      ? i % 4
                      : width >= 1024
                      ? i % 3
                      : width >= 640
                      ? i % 2
                      : undefined
                  }
                  product={product}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="container mx-auto pt-2 pb-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
