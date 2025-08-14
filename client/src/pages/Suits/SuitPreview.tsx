import Image from "../../components/Image";
import suitStore from "../../stores/suitStore";

const SuitPreview = () => {
  const { jacket, pants, vest, accessory, shoes, belt, shirt, tie } =
    suitStore();

  return (
    <div className="sticky z-10 top-0 min-h-[400px] sm:min-h-[500px] md:h-full w-full md:w-1/2 md:relative bg-cold-gray">
      {shirt && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={shirt?.image || "/public/images/suits/shirt.webp"}
          alt={shirt?.product?.name || ""}
          fromServer
        />
      )}

      {tie && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={tie?.image || "/public/images/suits/rabta.webp"}
          alt={tie?.product?.name || ""}
          fromServer
        />
      )}

      {shoes && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={shoes?.image || "/public/images/suits/rabta.webp"}
          alt={shoes?.product?.name || ""}
          fromServer
        />
      )}

      {pants && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={pants?.image || "/public/images/suits/pan.webp"}
          alt={pants?.product?.name || ""}
          fromServer
        />
      )}

      {vest && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={vest?.image || "/public/images/suits/under.png"}
          alt={vest?.product?.name || ""}
          fromServer
        />
      )}
      {belt && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={belt?.image || "/public/images/suits/rabta.webp"}
          alt={belt?.product?.name || ""}
          fromServer
        />
      )}
      {jacket && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={jacket?.image || "/public/images/suits/jacket.webp"}
          alt={jacket?.product?.name || ""}
          fromServer
        />
      )}

      {accessory && (
        <Image
          styles="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          src={accessory?.image || "/public/images/suits/rabta.webp"}
          alt={accessory?.product?.name || ""}
          fromServer
        />
      )}
    </div>
  );
};

export default SuitPreview;
