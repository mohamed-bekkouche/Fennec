import { FaCheck, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import type { ICartItem } from "../../stores/cartStore";
import Image from "../Image";
import { removeProduct, updateProduct } from "../../hooks/useCart";
import { useTranslation } from "react-i18next";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const CartCard = ({ cartIemt }: { cartIemt: ICartItem }) => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatCurrency();
  const { product, quantity, color, size } = cartIemt;

  const handleRemove = () => {
    removeProduct(product._id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateProduct(product._id, { quantity: newQuantity });
  };

  const handleColorChange = (newColor: string) => {
    updateProduct(product._id, { color: newColor });
  };

  const handleSizeChange = (newSize: string | number) => {
    updateProduct(product._id, { size: newSize });
  };

  return (
    <div className="bg-off-white h-full p-2 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-wrap relative">
        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className=" absolute top-2 right-2 bg-off-white text-red-500 hover:bg-off-white/70 cursor-pointer hover:text-red-600 p-2.5 rounded-full transition-colors"
          aria-label={t("components.orders.removeItem")}
        >
          <FaTrash className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="h-full flex-1 rounded-lg overflow-hidden border border-gray-200">
          <Image
            fromServer
            src={product.images[0]}
            alt={product.name}
            styles="w-full h-full object-cover aspect-square"
          />
        </div>

        <div className="w-full sm:flex-1 p-2 sm:ps-5 flex flex-col gap-2">
          {/* {Product Name} */}
          <h3 className="font-semibold text-off-black text-lg line-clamp-2">
            {product.name}
          </h3>

          {/* Color Selection */}
          <div className="">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("components.orders.color")}:
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((clr, i) => (
                <button
                  key={i}
                  onClick={() => handleColorChange(clr)}
                  style={{ backgroundColor: clr }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 cursor-pointer rounded-full border-2 flex items-center justify-center transition-all ${
                    clr === color
                      ? "border-gray-800 opacity-100"
                      : "border-gray-300 opacity-60 hover:opacity-80"
                  }`}
                  aria-label={`Select ${clr} color`}
                >
                  {clr === color && (
                    <FaCheck className="text-white text-xs sm:text-lg drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {typeof product.sizes !== "string" && (
            <div className="">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t("components.orders.size")}:
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sz, i) => (
                  <button
                    key={i}
                    onClick={() => handleSizeChange(sz)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2.5 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                      size === sz
                        ? "bg-off-black text-off-white"
                        : "bg-cold-gray text-off-black hover:bg-warm-gray/15"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t("components.orders.quantity")}:
            </p>
            <div className="flex w-fit items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="p-2 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-right">
              <div className="text-xl font-bold text-off-black">
                {(product.price * quantity).toLocaleString()} DA
              </div>
              <div className="text-sm text-gray-500">
                {product.price.toLocaleString()} DA × {quantity}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 items-center gap-6">
        {/* Product*/}
        <div className="col-span-4 flex items-center gap-1">
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={t("components.orders.removeItem")}
          >
            <FaTrash className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <Image
              fromServer
              src={product.images[0]}
              alt={product.name}
              styles="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-off-black text-[1rem] line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Color */}
        <div className="col-span-2 flex gap-1 flex-wrap justify-center">
          {product.colors.map((clr, i) => (
            <button
              key={i}
              onClick={() => handleColorChange(clr)}
              style={{ backgroundColor: clr }}
              className={`w-[30px] h-[30px] cursor-pointer rounded-full border-2 flex items-center justify-center transition-all ${
                clr === color
                  ? "border-gray-800 opacity-100"
                  : "border-gray-300 opacity-60 hover:opacity-80"
              }`}
              aria-label={`Select ${clr} color`}
            >
              {clr === color && (
                <FaCheck className="text-white text-xs drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Size */}
        {typeof product.sizes !== "string" && (
          <div className="col-span-3 flex gap-1 flex-wrap justify-center">
            {product.sizes.map((sz, i) => (
              <button
                key={i}
                onClick={() => handleSizeChange(sz)}
                className={`p-3 cursor-pointer rounded text-sm font-medium transition-colors ${
                  size === sz
                    ? "bg-off-black text-off-white"
                    : "bg-cold-gray text-off-black hover:bg-warm-gray/15"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="col-span-1">
          <div className=" mx-auto w-fit flex items-center justify-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-1 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <FaMinus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 border-x border-gray-300 font-medium text-sm min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-1 cursor-pointer hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <FaPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Price and Remove */}
        <div className="col-span-2 text-end">
          <p className="text-lg font-semibold text-off-black">
            {formatCurrency(product.price * quantity)}
          </p>
          <p className="text-xs text-gray-500">
            {formatCurrency(product.price)} × {quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
