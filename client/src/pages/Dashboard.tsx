import { NavLink, Outlet } from "react-router-dom";
import Image from "../components/Image";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const links = [
    {
      name: t("dashboard.settings"),
      to: "setting",
    },
    {
      name: t("dashboard.orders"),
      to: "orders",
    },
    {
      name: t("dashboard.wishList"),
      to: "wish-list",
    },
  ];
  return (
    <div className="bg-off-white min-h-[calc(100dvh-52px)] py-10 container">
      <div className="mb-5">
        <div>
          <div className="flex items-center gap-2 md:gap-4 justify-center mb-5 md:mb-10">
            <div className="h-16 w-16 sm:h-20 sm:w-20 block relative rounded-full bg-off-black text-white font-normal text-xl content-center text-center uppercase">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  styles="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  fromServer={!user.avatar.includes("https")}
                />
              ) : (
                <>{user?.username?.charAt(0)}</>
              )}
              <span className="block absolute bottom-1 right-2 w-3 h-3 rounded-full bg-green-400 z-10" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-bold capitalize mb-1">
                {" "}
                {user?.username}{" "}
              </p>
              <p className="text-sm md:text-lg text-warm-gray/60">
                {" "}
                {user?.email}{" "}
              </p>
            </div>
          </div>
          <ul className="flex gap-2 items-center justify-center ">
            {links.map((link, key) => (
              <li
                className="has-[a.active]:bg-cold-gray/60 text-[0.9rem] font-bold capitalize px-5 py-2 rounded-full"
                key={key}
              >
                <NavLink to={link.to}> {link.name} </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t-warm-gray/20 border-t pt-5">
        <Outlet />
      </div>
    </div>
  );
};
