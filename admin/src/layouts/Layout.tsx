import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo/Logo";
import {
  TbLayoutDashboard,
  TbLayoutDashboardFilled,
  TbTruckDelivery,
} from "react-icons/tb";
import { RiCoupon2Fill, RiCoupon2Line } from "react-icons/ri";

import { TfiPackage } from "react-icons/tfi";
import {
  PiMedalFill,
  PiMedalLight,
  PiPackageFill,
  PiUsersThreeFill,
  PiUsersThreeLight,
} from "react-icons/pi";
import { FaTruckFast } from "react-icons/fa6";
import {
  IoSettingsOutline,
  IoSettings,
  IoPricetagsOutline,
  IoPricetags,
} from "react-icons/io5";
import { IoMdHelpCircleOutline, IoMdHelpCircle } from "react-icons/io";
import { useAuth } from "../hooks/useAuth";
import UserDropdown from "../components/UserDropDown";
import { MdCollections, MdOutlineCollections } from "react-icons/md";
import { useEffect } from "react";
import { useMeta } from "../hooks/useMeta";
import { getAllCategories } from "../services/categoryService";
import { getAllBrands } from "../services/brandService";
import { getAllCollections } from "../services/collectionService";

function Layout() {
  const { setMeta } = useMeta();
  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <TbLayoutDashboard />,
      activeIcon: <TbLayoutDashboardFilled />,
    },
    {
      name: "Products",
      href: "/products",
      icon: <TfiPackage />,
      activeIcon: <PiPackageFill />,
    },
    {
      name: "Orders",
      href: "/orders",
      icon: <TbTruckDelivery />,
      activeIcon: <FaTruckFast />,
    },
    {
      name: "Users",
      href: "/users",
      icon: <PiUsersThreeLight />,
      activeIcon: <PiUsersThreeFill />,
    },
    {
      name: "Coupons",
      href: "/coupons",
      icon: <RiCoupon2Line />,
      activeIcon: <RiCoupon2Fill />,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: <IoPricetagsOutline />,
      activeIcon: <IoPricetags />,
    },
    {
      name: "Brands",
      href: "/brands",
      icon: <PiMedalLight />,
      activeIcon: <PiMedalFill />,
    },
    {
      name: "Collections",
      href: "/collections",
      icon: <MdOutlineCollections />,
      activeIcon: <MdCollections />,
    },
  ];

  const supportLinks = [
    {
      name: "Setting",
      href: "/setting",
      icon: <IoSettingsOutline />,
      activeIcon: <IoSettings />,
    },
    {
      name: "Help & Center",
      href: "/hepl",
      icon: <IoMdHelpCircleOutline />,
      activeIcon: <IoMdHelpCircle />,
    },
  ];

  const { admin } = useAuth();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [
          {
            data: { categories },
          },
          {
            data: { brands },
          },
          {
            data: { collections },
          },
        ] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
          getAllCollections(),
        ]);
        setMeta({ categories, collections, brands });
      } catch (err) {
        console.error("Meta fetch failed:", err);
      }
    };
    fetchMeta();

    // const { categories } = metaStore.getState();
    // if (categories.length === 0) fetchMeta();
  }, []);

  return (
    <div className="w-full h-dvh overflow-hidden flex items-start bg-off-black text-off-white">
      <aside className="w-64">
        <div className="flex items-center w-full justify-center py-6 mb-10">
          <Logo />
        </div>
        <p className="text-cold-gray/70 text-xs pl-6 mb-3"> MAIN MENU </p>
        <nav className="mb-10">
          {links.map((link, key) => (
            <NavLink
              key={key}
              to={link.href}
              className={({ isActive }) => {
                const baseClasses =
                  "flex items-center gap-2 text-[0.95rem] mb-2 px-5 py-[15px] relative transition-colors duration-300 font-light";
                const activeClasses =
                  "bg-off-white/10 text-off-white font-medium after:content-[''] after:absolute after:right-0 after:top-0 after:w-1 after:rounded-full after:h-full after:bg-off-white";
                const inactiveClasses =
                  "text-cold-gray/60 hover:bg-off-white/10 hover:text-off-white hover:font-medium";

                return `${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <span className={`text-2xl`}>
                    {isActive ? link.activeIcon : link.icon}
                  </span>
                  {link.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <p className="text-cold-gray/70 text-xs pl-6 mb-3"> HELP & SUPPORT </p>
        <nav className="mb-10">
          {supportLinks.map((link, key) => (
            <NavLink
              key={key}
              to={link.href}
              className={({ isActive }) => {
                const baseClasses =
                  "flex items-center gap-2 text-[0.95rem] mb-2 px-5 py-[15px] relative transition-colors duration-300 font-light";
                const activeClasses =
                  "bg-off-white/10 text-off-white font-medium after:content-[''] after:absolute after:right-0 after:top-0 after:w-1 after:rounded-full after:h-full after:bg-off-white";
                const inactiveClasses =
                  "text-cold-gray/60 hover:bg-off-white/10 hover:text-off-white hover:font-medium";

                return `${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <span className={`text-2xl`}>
                    {isActive ? link.activeIcon : link.icon}
                  </span>
                  {link.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 h-full flex flex-col">
        <header className="w-full py-3 bg-off-black flex items-center justify-between ">
          <h1 className="text-2xl"> Welcom Again {admin?.username} </h1>
          <UserDropdown />
        </header>
        <main className="flex-1 h-full overflow-hidden p-3 bg-warm-gray">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
