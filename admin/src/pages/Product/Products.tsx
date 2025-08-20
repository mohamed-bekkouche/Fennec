import { useForm } from "react-hook-form";
import InputField from "../../components/Inputs/InputField";
import Button from "../../components/Buttons/Button";
import { FaPlus } from "react-icons/fa6";
import { ProductItem } from "../../components/Product/ProductItem";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import type { IProduct } from "../../types/Product";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, _] = useState(10);

  const { register, watch } = useForm<{
    isAvailable: string | null;
    name: string | null;
    sortBy: "createdAt" | "name" | "price" | "cost";
    order: "asc" | "desc";
  }>({
    defaultValues: {
      isAvailable: null,
      name: null,
      sortBy: "createdAt",
      order: "asc",
    },
  });

  const { isAvailable, name, sortBy, order } = watch();

  const fetchProduct = async (params = {}) => {
    try {
      const { data } = await getProducts(params);
      setProducts(data.products);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  function onDelete(productId: string) {
    setProducts(products.filter((prd) => prd._id !== productId));
  }

  useEffect(() => {
    fetchProduct({
      name,
      sortBy,
      isAvailable,
      page: currentPage,
      limit,
      order,
    });
  }, [name, sortBy, isAvailable, order, currentPage, limit]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="bg-off-black p-3 rounded-sm flex items-center justify-between">
        <div className="flex basis-2/3 items-center gap-4">
          <InputField
            name="name"
            placeholder="Search For Product..."
            type="search"
            register={register}
            className="focus:!translate-y-0 !py-2 !mb-0"
          />

          <select
            id="isAvailable"
            {...register("isAvailable")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">Sort by All Product</option>
            <option value="true">Sort by Available</option>
            <option value="false">Sort by Not Available</option>
          </select>

          <select
            {...register("sortBy")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="cost">Sort by Cost</option>
          </select>

          <select
            {...register("order")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="asc"> Ascending </option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <Button
          content={
            <Link to="new-product" className="flex gap-2 items-center">
              <FaPlus className="text-lg" />
              New Product
            </Link>
          }
          styles="rounded-sm w-fit"
        />
      </div>

      <div className="flex-1 h-full w-full bg-off-black overflow-hidden p-2 pb-0 rounded-sm flex flex-col">
        <div className="grid lg:grid-cols-12 gap-4 text-cold-gray/70 text-xs uppercase tracking-wide mb-3">
          <div className="col-span-4">Product</div>
          <div className="col-span-1">Cost</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1 text-center">Stock</div>
          <div className="col-span-1">Delivered</div>
          <div className="col-span-1">Rating</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-end">Actions</div>
        </div>

        <div className="w-full flex-1 overflow-scroll">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              onDelete={onDelete}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Products;
