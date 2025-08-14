import { Link } from "react-router-dom";
import Image from "./Images/Image";
import toast from "react-hot-toast";
import { logOutAdmin } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import Button from "./Buttons/Button";

const UserDropdown = () => {
  const { admin, logout } = useAuth();
  const logOut = async () => {
    try {
      await logOutAdmin();
      toast.success("Log out success");
    } catch (error) {
      toast.error("Log out failed");
    } finally {
      logout();
    }
  };
  return (
    <div className="relative group w-fit h-fit">
      <Link
        to="/dashboard"
        className="w-12 h-12 block relative rounded-full bg-off-black text-white font-normal text-xl content-center text-center uppercase"
      >
        {admin?.avatar ? (
          <Image
            src={admin.avatar}
            alt={admin.username}
            styles="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
            fromServer={true}
          />
        ) : (
          <>{admin?.username?.charAt(0)}</>
        )}
        <span className="block absolute bottom-0 right-1 w-2.5 h-2.5 rounded-full bg-green-400 z-10" />
      </Link>

      <div className="absolute w-xs border border-cold-gray/20 end-0 bottom-0 translate-y-full bg-off-black shadow-lg shadow-off-black/10 p-5 rounded-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto z-50 duration-300">
        <Link
          to="/dashboard"
          className="w-11 h-11 block mx-auto relative rounded-full bg-off-black text-white text-xl content-center text-center uppercase mb-2"
        >
          {admin?.avatar ? (
            <Image
              src={admin.avatar}
              alt={admin.username}
              styles="w-full h-full rounded-full object-cover"
              fromServer={true}
            />
          ) : (
            <>
              {admin?.username?.charAt(0)}
              <span className="block absolute bottom-0 right-1 w-2 h-2 rounded-full bg-green-400" />
            </>
          )}
        </Link>
        <p className="text-lg font-medium text-center mb-4 capitalize">
          {admin?.username}
        </p>
        <Link
          to="/dashboard/setting"
          className="mb-4 block text-cold-gray/80 text-sm"
        >
          Setting
        </Link>
        <hr className="mb-4 text-warm-gray/40" />
        <Button
          type="button"
          content={"Log Out"}
          action={logOut}
          //   className="text-warm-gray cursor-pointer text-sm"
        />
      </div>
    </div>
  );
};

export default UserDropdown;
