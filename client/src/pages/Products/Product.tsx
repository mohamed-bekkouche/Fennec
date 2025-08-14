import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "../../components/Image";
import {
  FaCalendar,
  FaCheck,
  FaHeart,
  FaMinus,
  FaPlus,
  FaTruck,
  FaChevronLeft,
  FaChevronRight,
  FaXmark,
  FaMagnifyingGlassPlus,
} from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { setProfile, useAuth } from "../../hooks/useAuth";

import Collection from "../../components/Collection/Collection";
import type { IProduct } from "../../types/Product";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import {
  addToWishlist,
  getProduct,
  removeFromWishlist,
} from "../../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import ButtonColored from "../../components/Buttons/ButtonColored";
import { addProduct } from "../../hooks/useCart";

import { useTranslation } from "react-i18next";
import { FaShieldAlt } from "react-icons/fa";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const Product = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "products.product" });
  const { formatCurrency } = useFormatCurrency();
  const { user } = useAuth();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  const [selectedSize, setSelectedSize] = useState<string | number>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const images = useMemo(() => product?.images ?? [], [product]);

  const changeImagePreview = (i: number) => {
    setCurrentImageIndex(i);
  };

  const changeSize = (size: string | number) => {
    setSelectedSize(size);
  };

  const changeColor = (color: string) => {
    setSelectedColor(color);
  };

  const handleQuantity = (operation: "+" | "-") => {
    if (!product) return;
    if (operation === "+") {
      if (quantity < product.stock) setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) setQuantity((prev) => prev - 1);
    }
  };

  const fetchProduct = async () => {
    try {
      const {
        data: { product, similarProducts },
      } = await getProduct(productId as string);
      setProduct(product);
      setSelectedSize(
        Array.isArray(product?.sizes) && product.sizes.length
          ? product.sizes[0]
          : "one-size"
      );
      setSelectedColor(product?.colors?.[0] ?? "#000000");
      setSimilarProducts(similarProducts);
      setCurrentImageIndex(0);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching product");
    }
  };

  const addProductToCart = () => {
    if (!product) return;
    addProduct(product, selectedColor, selectedSize, quantity);
    toast.success(t("addedToCart"));
  };

  const handleWishlist = async (productId: string) => {
    try {
      if (!user) {
        toast.error(t("loginForWishlist"));
        return;
      }

      if (user.wishList?.includes(productId)) {
        await removeFromWishlist(productId);
        setProfile({
          ...user,
          wishList: user.wishList.filter((id) => id !== productId),
        });
        toast.success(t("removedFromWishlist"));
      } else {
        await addToWishlist(productId);
        setProfile({
          ...user,
          wishList: [...(user.wishList || []), productId],
        });
        toast.success(t("addedToWishlist"));
      }
    } catch (error: any) {
      console.error("Wishlist error:", error);
      toast.error(error?.response?.data?.message || t("wishlistUpdateFailed"));
    }
  };

  const nextImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const onLightboxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isLightboxOpen, nextImage, prevImage]);

  if (!product) {
    return <Loader />;
  }

  const discountPercentage = product.oldPrice
    ? Math.ceil(100 - (product.price / product.oldPrice) * 100)
    : 20;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 mb-16">
          {/* Image Gallery - Left Side */}
          <section className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-3">
              {/* Vertical thumbnail rail (desktop) */}
              <div className="hidden md:block col-span-2">
                <div className="sticky top-24 max-h-[70vh] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => changeImagePreview(i)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          i === currentImageIndex
                            ? "border-off-black/70 shadow-md"
                            : "border-warm-gray/20 hover:border-off-black/70"
                        }`}
                        aria-label={`Thumbnail ${i + 1}`}
                      >
                        <Image
                          styles="w-full h-full object-cover"
                          src={img}
                          alt={`${product.name}-thumb-${i + 1}`}
                          fromServer
                        />
                        {i === currentImageIndex && (
                          <span className="absolute inset-0 ring-2 ring-blue-500 rounded-xl pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main image */}
              <div className="col-span-12 md:col-span-10">
                <div className="relative group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-cold-gray shadow-md border border-warm-gray/30">
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div
                        dir="ltr"
                        className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10"
                      >
                        -{discountPercentage}%
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlist(product._id)}
                      className="absolute top-3 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 lg:opacity-0 group-hover:opacity-100 z-10"
                    >
                      {user?.wishList?.includes(product._id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FiHeart className="text-warm-gray/80" />
                      )}
                    </button>

                    {/* Zoom Button */}
                    <button
                      onClick={() => {
                        setIsLightboxOpen(true);
                        setIsZoomed(false);
                      }}
                      className="absolute bottom-3 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 lg:opacity-0 group-hover:opacity-100 z-10"
                    >
                      <FaMagnifyingGlassPlus className="text-warm-gray/80" />
                    </button>

                    {images.length > 0 ? (
                      <Image
                        styles="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={images[currentImageIndex]}
                        alt={product.name}
                        fromServer
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-warm-gray/50">
                        <span className="text-sm">No image available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile horizontal thumbs */}
                {images.length > 1 && (
                  <div className="md:hidden mt-4 overflow-x-auto">
                    <div className="flex gap-3 snap-x snap-mandatory pb-2">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => changeImagePreview(i)}
                          className={`snap-start shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            i === currentImageIndex
                              ? "border-off-black/70 shadow-md"
                              : "border-warm-gray/20"
                          }`}
                        >
                          <Image
                            styles="w-full h-full object-cover"
                            src={img}
                            alt={`${product.name}-thumb-${i + 1}`}
                            fromServer
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Product Details - Right Side */}
          <section className="lg:col-span-5 space-y-8">
            {/* Header Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.stock > 0 ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? t("inStock") : t("outOfStock")}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-off-black leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-off-black">
                  {formatCurrency(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-warm-gray/50 line-through">
                    {formatCurrency(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-off-black mb-3">
                  {t("selectColor")}:{" "}
                  <span className="font-normal capitalize">
                    {selectedColor}
                  </span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => changeColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-12 h-12 rounded-full border-4 transition-all duration-200 flex items-center justify-center ${
                        color === selectedColor
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      title={color}
                    >
                      {color === selectedColor && (
                        <FaCheck className="text-white text-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-off-black mb-3">
                  {t("selectSize")}: :{" "}
                  <span className="font-normal">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => changeSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        size === selectedSize
                          ? "border-cold-gray bg-off-black text-white"
                          : "border-warm-gray/10 bg-off-white text-off-black hover:border-warm-gray/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-sm font-semibold text-off-black mb-3">
                {t("quantity")}:{" "}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantity("-")}
                    disabled={quantity <= 1}
                    className="p-3 text-off-white bg-off-black/90 hover:bg-off-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="px-4 py-3 font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity("+")}
                    disabled={quantity >= product.stock}
                    className="p-3 text-off-white bg-off-black/90 hover:bg-off-black rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="text-sm" />
                  </button>
                </div>
                <span className="text-sm text-warm-gray/60">
                  {product.stock} {t("inStock")}{" "}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ButtonColored
                  variant="cta"
                  content={t("addToCart")}
                  styles="!py-4 !text-lg !font-semibold !rounded-md"
                  action={addProductToCart}
                />
                <ButtonColored
                  variant="success"
                  content={t("buyNow")}
                  styles="!py-4 !text-lg !font-semibold !rounded-md"
                  action={() => {
                    addProductToCart();
                    navigate("/checkout");
                  }}
                />
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaTruck className="text-blue-600" />
                </div>
                <p className="text-sm font-medium text-off-black">
                  {t("delivery")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaShieldAlt className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-off-black">
                  {t("guarantee")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaCalendar className="text-purple-600" />
                </div>
                <p className="text-sm font-medium text-off-black">
                  {t("return")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Product Information Tabs */}
        <div className="mb-16">
          <div className={`px-1 text-sm font-medium transition-colors mb-1`}>
            {t("description")}:
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tab Content */}
            <div className="prose prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-off-black mb-4">
                {t("otherProducts")}
              </h2>
              <p className="text-lg text-warm-gray/70 max-w-2xl mx-auto">
                {t("discoverProducs")}
              </p>
            </div>
            <Collection
              styles="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-8"
              collection={similarProducts}
            />
          </div>
        )}

        {/* Advanced Lightbox */}
        {isLightboxOpen && images.length > 0 && (
          <div
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => {
                setIsLightboxOpen(false);
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full border-2 md:border-none border-white/80 bg-black/50 hover:bg-black/70 md:bg-white/20 md:hover:bg-white/30 text-white z-20"
              aria-label="Close"
            >
              <FaXmark className="text-2xl" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full max-md:hidden bg-white/20 hover:bg-white/30 text-white z-20"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={nextImage}
              className="absolute max-md:hidden right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white z-20"
              aria-label="Next image"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            <div className="h-full w-full flex flex-col items-center justify-center px-4">
              <div
                className="relative max-w-6xl w-full"
                onMouseMove={onLightboxMove}
                onClick={() => setIsZoomed((z) => !z)}
              >
                <div
                  className="overflow-hidden rounded-xl border border-white/10"
                  style={{
                    cursor: isZoomed ? "zoom-out" : "zoom-in",
                  }}
                >
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${product.name} - ${currentImageIndex + 1}`}
                    styles={`w-full max-h-[78vh] object-contain select-none`}
                    fromServer
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                            transform: "scale(1.7)",
                            transition: "transform 120ms ease",
                          }
                        : {
                            transform: "scale(1)",
                            transition: "transform 120ms",
                          }
                    }
                    draggable={false}
                  />
                </div>
                <p className="text-white/70 text-xs mt-2 text-center">
                  {isZoomed ? t("zoom") : t("exitZoom")}
                </p>
              </div>

              {/* Lightbox thumbs */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto max-w-6xl w-full">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border ${
                        i === currentImageIndex
                          ? "border-white"
                          : "border-white/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumb-${i + 1}`}
                        styles="w-full h-full object-cover"
                        fromServer
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
