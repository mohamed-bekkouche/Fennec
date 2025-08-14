import { Link, Outlet } from "react-router-dom";
import Image from "../../components/Image";
import Logo from "../../layouts/NavComponents/Logo";
import { FaArrowLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-dvh bg-off-white flex items-stretch">
      <div className="flex-2 flex flex-col">
        <div className="py-5 px-10 flex justify-between items-center relative">
          <Logo />
          <Link
            className="rounded-full px-4 md:px-6 text-sm md:text-normal py-1.5 bg-off-black/10 border-off-black/50 shadow-sm border-[0.5px] text-off-black cursor-pointer md:-mb-1.5 flex gap-2 items-center"
            to="/"
          >
            {" "}
            <FaArrowLeft /> {t("auth.cta")}
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Outlet />
        </div>
      </div>
      <div className="hidden sm:block flex-1">
        <Image
          styles="w-full h-full object-cover"
          alt="good"
          src="/images/hero/5.avif"
        />
      </div>
    </div>
  );
};

export default Auth;
