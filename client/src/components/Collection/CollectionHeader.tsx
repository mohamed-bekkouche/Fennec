import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import { useTranslation } from "react-i18next";

const CollectionHeader = ({
  title,
  link = "/",
}: {
  title: string;
  link?: string;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className=" flex justify-between items-center ">
      <h3 className="font-the-seasons  pl-1 tracking-wider  uppercase font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        {title}
      </h3>
      <Button
        styles="!rounded-none !w-fit text-xs lowercase md:uppercase md:!text-sm !font-light bg-off-black hover:text-off-black border-off-black"
        action={() => navigate(link)}
        content={t("components.collectionHeader.cta")}
      />
    </div>
  );
};

export default CollectionHeader;
