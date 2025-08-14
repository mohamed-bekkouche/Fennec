import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface ISocialMedia {
  icon: ReactElement<any, any>;
  link: string;
}
const Footer = () => {
  const { t } = useTranslation();
  const Links = [
    { name: t("layouts.nav.home"), to: "/" },
    { name: t("layouts.nav.about"), to: "/about" },
    { name: t("layouts.nav.contact"), to: "/contact" },
    { name: t("layouts.footer.products"), to: "/products" },
    { name: t("layouts.footer.store"), to: "/store" },
  ];
  const socialMedias: ISocialMedia[] = [
    {
      icon: <FaFacebook />,
      link: "facebook.com",
    },
    {
      icon: <FaInstagram />,
      link: "instagram.com",
    },
    {
      icon: <FaTiktok />,
      link: "toktok.com",
    },
  ];
  return (
    <footer className="bg-off-black py-5 text-off-white">
      <div className="container ">
        <div className="font-the-seasons font-bold w-fit relative h-fit mb-3 mx-auto">
          <p className="uppercase text-xl md:text-3xl tracking-wide">
            {" "}
            Fennec{" "}
          </p>
          <p className="absolute max-md:text-xs -0 bottom-0 translate-1/2 text-amber-500">
            Wear
          </p>
        </div>
        <ul className="flex items-center gap-3 justify-center mb-4 max-md:text-xs">
          {Links.map((link, key) => (
            <li key={key} className="font-light hover:font-medium duration-200">
              <Link to={link.to}> {link.name} </Link>{" "}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3.5 justify-center mx-auto mb-6">
          {socialMedias.map((socialMedia, key) => (
            <Link
              key={key}
              className="rounded-full text-lg md:text-2xl hover:scale-125 duration-200 text-off-white"
              to={socialMedia.link}
            >
              {" "}
              {socialMedia.icon}{" "}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[0.5px] md:h-[1px] bg-off-white mb-5"></div>
      <p className="text-center text-xs md:text-sm text-cold-gray/80">
        {t("layouts.footer.rights")}
      </p>
    </footer>
  );
};

export default Footer;
