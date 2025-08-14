import { FaArrowLeft, FaCartShopping, FaXmark } from "react-icons/fa6";
import Image from "../../components/Image";
import suitStore from "../../stores/suitStore";
import ButtonColored from "../../components/Buttons/ButtonColored";
import { Link, useNavigate } from "react-router-dom";
import cartStore from "../../stores/cartStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const OverView = () => {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatCurrency();
  const navigate = useNavigate();
  const { removeElement, getSuitSummary } = suitStore();
  const { elements, totalPrice } = getSuitSummary();
  const { addProduct } = cartStore();

  const addElementsToCart = () => {
    elements.map((element) => {
      if (element)
        addProduct(
          element.product,
          element.product.colors[0],
          element.product.sizes === "onsize"
            ? "onsize"
            : element.product.sizes[0],
          1
        );
    });
    toast.success(t("suits.overview.addedToCart"));
    setTimeout(() => {
      navigate("/cart");
    }, 800);
  };
  return (
    <div className="h-full py-5 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {elements.map((element) => {
          if (!element) return;
          return (
            <div className="bg-cold-gray p-2 md:p-3 rounded-sm mb-3 relative flex items-center justify-between">
              <div className="flex items-start gap-2.5 md:gap-4">
                <Image
                  src={element.product?.images[0] || ""}
                  alt={element.product?.name}
                  styles="w-20 h-20 md:w-24 md:h-24 rounded-sm"
                  fromServer
                />
                <div>
                  <p className="text-[1rem] md:text-lg font-medium">
                    {" "}
                    {element.product.name}{" "}
                  </p>
                  <p className="text-xs md:text-sm text-warm-gray/65">
                    {" "}
                    {element.product.sizes === "onsize"
                      ? "onsize"
                      : element.product.sizes[0]}{" "}
                    /
                    <span
                      style={{ backgroundColor: element.product.colors[0] }}
                      className="inline-block h-3 w-6 ms-1.5 border"
                    />
                  </p>
                </div>
              </div>
              <p className="text-sm md:text-lg font-medium">
                {formatCurrency(element.product?.price)}
              </p>
              <button
                onClick={() => removeElement(element.type)}
                className="cursor-pointer absolute top-2 end-2 text-lg md:text-xl text-red-400 hover:text-red-700 duration-100"
              >
                <FaXmark />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center py-2 text-lg md:text-2xl font-medium">
        <p className="text-warm-gray/90"> {t("suits.overview.totalPrice")} </p>{" "}
        <p className="text-green-500"> {formatCurrency(totalPrice)} </p>{" "}
      </div>
      <div className="flex max-sm:flex-wrap items-center gap-2 justify-end pt-3">
        <button className="max-sm:flex-1">
          <Link
            className="flex justify-center text-nowrap text-sm items-center gap-1.5 uppercase py-3.5 px-8 font-bold text-blue-600 hover:text-blue-700 duration-200"
            to="/customize/accessories"
          >
            <FaArrowLeft size={16} /> {t("suits.overview.returnToAccessories")}{" "}
          </Link>
        </button>
        <ButtonColored
          action={addElementsToCart}
          styles="max-sm:flex-1 !py-2.5 md:!py-3.5 !px-8"
          content={
            <>
              {t("suits.overview.addToCart")} <FaCartShopping size={16} />{" "}
            </>
          }
        />
      </div>
    </div>
  );
};

export default OverView;
