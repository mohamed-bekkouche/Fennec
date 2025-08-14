import { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaCartShopping, FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { IoLanguage } from "react-icons/io5";
import { Luanguages } from "./NavComponents/Luanguages";
import MobileMenu from "./NavComponents/MobileMenu";
import NavigationLinks from "./NavComponents/NavigationLinks";
import Logo from "./NavComponents/Logo";
import { NavIcon } from "./NavComponents/NavIcon";
import UserDropdown from "./NavComponents/UserDropdown";
import SearchToggleInput from "./NavComponents/SearchToggleInput";
import MobileSearchBar from "./NavComponents/MobileSearchBar";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export interface ILink {
  name: string;
  to: string;
}

const NavBar = () => {
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const Links: ILink[] = [
    { name: t("layouts.nav.home"), to: "/" },
    { name: t("layouts.nav.about"), to: "/about" },
    { name: t("layouts.nav.contact"), to: "/contact" },
  ];

  const [showNav, setShowNav] = useState(true);
  const [showLinks, setShowLinks] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      animate={{ y: showNav ? 0 : "-110%" }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: "easeInOut",
      }}
      className="sticky top-0 w-full z-[999] bg-off-white shadow-xs"
    >
      <motion.nav
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 0.3,
          delay: 0.4,
          ease: "easeInOut",
        }}
        className="container flex items-center justify-between relative py-2 z-10 bg-off-white"
      >
        <div className="flex items-center gap-6 lg:gap-16">
          <Logo />
          <NavigationLinks Links={Links} />
        </div>

        <div className="flex items-center gap-3 lg:gap-10">
          <div className="flex items-center relative z-20 gap-2 sm:gap-3">
            <SearchToggleInput />
            {!showSearchBar && (
              <NavIcon
                icon={<FiSearch />}
                action={() => setShowSearchBar(true)}
                styles="lg:hidden"
              />
            )}
            <Link to={cartItems?.length > 0 ? "/cart" : "#"}>
              <NavIcon icon={<FaCartShopping />}>
                {cartItems?.length > 0 && (
                  <span className=" absolute block top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 w-2.5 h-2.5 text-sm text-center rounded-full text-off-white" />
                )}
              </NavIcon>
            </Link>
            <NavIcon
              icon={<IoLanguage />}
              action={() => setShowLanguages(!showLanguages)}
            >
              <Luanguages
                showLanguages={showLanguages}
                setShowLanguages={setShowLanguages}
              />
            </NavIcon>
            <NavIcon
              icon={showLinks ? <FaXmark /> : <FiMenu />}
              action={() => setShowLinks(!showLinks)}
              styles="sm:hidden"
            />
          </div>
          <UserDropdown />
        </div>
      </motion.nav>

      <MobileMenu
        showLinks={showLinks}
        setShowLinks={setShowLinks}
        links={Links}
      />

      <MobileSearchBar
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
      />
    </motion.header>
  );
};

export default NavBar;
