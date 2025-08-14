import type { IProduct } from "../../types/Product";
import ProductCard from "../ProductCard";

const Collection = ({
  collection,
  styles,
}: {
  collection: IProduct[];
  styles?: string;
}) => {
  return (
    <div
      className={`py-5 grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10 mb-4 ${styles} items-stretch`}
    >
      {collection.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Collection;
