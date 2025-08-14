import { Link } from "react-router-dom";
import { logout, useAuth } from "../../hooks/useAuth";
import Image from "../../components/Image";
import toast from "react-hot-toast";
import { logOutUser } from "../../services/authService";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const UserDropdown = () => {
  const { user } = useAuth();
  const { t } = useTranslation(undefined, {
    keyPrefix: "layouts.nav.userDropdown",
  });
  const [visible, setVisible] = useState(false);
  const logOut = async () => {
    try {
      await logOutUser();
      toast.success(t("success"));
    } catch (error) {
      toast.error(t("error"));
    } finally {
      logout();
    }
  };
  return (
    <>
      {!user && (
        <div className="ml-0 flex gap-3 font-semibold text-sm">
          <Link
            to="/auth/register"
            className="px-2 py-2.5 rounded-full max-md:hidden"
          >
            {t("signUp")}
          </Link>
          <Link
            to="/auth/login"
            className="bg-off-black px-5 py-2.5 text-white rounded-full"
          >
            {t("logIn")}
          </Link>
        </div>
      )}

      {user && (
        <div className="relative group">
          <button
            onClick={() => setVisible(!visible)}
            className="h-10 w-10 lg:w-11 lg:h-11 block relative rounded-full bg-off-black text-white font-normal text-xl content-center text-center uppercase"
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                styles="w-full h-full rounded-full object-cover"
                fromServer={!user.avatar.includes("https")}
              />
            ) : (
              <>{user?.username?.charAt(0)}</>
            )}
            <span className="block absolute bottom-0 right-1 w-2.5 h-2.5 rounded-full bg-green-400 z-10" />
          </button>

          <div
            className={`absolute w-xs end-0 bottom-0 translate-y-full bg-off-white shadow-xl p-5 rounded-lg  group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto z-50 duration-300 ${
              visible
                ? "visible opacity-100 pointer-events-auto"
                : "invisible opacity-0 pointer-events-none"
            }`}
          >
            <Link
              to="/dashboard"
              className="w-11 h-11 block mx-auto relative rounded-full bg-off-black text-white text-xl content-center text-center uppercase mb-2"
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  styles="w-full h-full rounded-full object-cover"
                  fromServer={!user.avatar.includes("https")}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  {user?.username?.charAt(0)}
                  <span className="block absolute bottom-0 right-1 w-2 h-2 rounded-full bg-green-400" />
                </>
              )}
            </Link>
            <p className="text-lg font-medium text-center mb-4 capitalize">
              {user.username}
            </p>
            <Link
              to="/dashboard/setting"
              className="mb-4 block text-warm-gray text-sm"
            >
              {t("setting")}
            </Link>
            <hr className="mb-4 text-warm-gray/40" />
            <button
              type="button"
              onClick={() => logOut()}
              className="text-warm-gray cursor-pointer text-sm"
            >
              {t("logOut")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDropdown;
