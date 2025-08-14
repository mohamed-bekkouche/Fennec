import { useState, useEffect } from "react";
import { getProductById } from "../../services/productService";
import NewProduct from "./NewProduct";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(productId as string);
        setProduct(data.product);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div> ...Loading </div>;

  return <NewProduct product={product} />;
};

export default EditProduct;
