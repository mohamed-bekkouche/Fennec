import { FaUserShield } from "react-icons/fa6";
import type { IUser } from "../../types/User";
import Image from "../Images/Image";
import Button from "../Buttons/Button";
import { BsLockFill, BsUnlockFill } from "react-icons/bs";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import toast from "react-hot-toast";
import { toggleBlockUser, makeAdmin } from "../../services/userService";
import { formatDate } from "../../utils/formData";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const UserItem = ({
  user,
  onMakeAdmin,
  onToggleBlock,
}: {
  user: IUser;
  onToggleBlock: (userId: string, block: boolean) => void;
  onMakeAdmin: (userId: string) => void;
}) => {
  const [blockModal, setBlockModal] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState({
    delete: false,
    block: false,
    admin: false,
  });

  const handleToggleBlockUser = async () => {
    setIsLoading((prev) => ({ ...prev, block: true }));
    try {
      await toggleBlockUser(user._id);
      setBlockModal(false);
      toast.success(
        `User ${user.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      onToggleBlock(user._id, user.isBlocked);
    } catch (error: any) {
      console.log("Error Blocking User: ", error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${user.isBlocked ? "unblock" : "block"} user`
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, block: false }));
    }
  };

  const handleMakeAdmin = async () => {
    setIsLoading((prev) => ({ ...prev, admin: true }));
    try {
      await makeAdmin(user._id);
      setAdminModal(false);
      toast.success("User promoted to admin successfully");
      onMakeAdmin(user._id);
    } catch (error: any) {
      console.log("Error Making Admin: ", error);
      toast.error(
        error?.response?.data?.message || "Failed to make user admin"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, admin: false }));
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard
      .writeText(user.email)
      .then(() => {
        toast.success("Email copied to clipboard!");
      })
      .catch((error: any) => {
        toast.error(error?.message || "Failed to copy email");
      });
  };

  return (
    <div className="grid bg-warm-gray grid-cols-10 items-center gap-4 text-off-white text-sm p-2 mb-2 tracking-wide overflow-y-">
      <div className="col-span-3 flex gap-3 items-center">
        <div className="w-12 h-12 bg-white rounded-full overflow-hidden">
          <Link to={user._id}>
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={user.username}
              fromServer={!user.avatar?.includes("http")}
              styles="w-full h-full object-cover"
            />
          </Link>
        </div>
        <div>
          <Link to={user._id} className="text-base font-semibold mb-1">
            {user.username}
          </Link>
          <p
            onClick={copyEmailToClipboard}
            title="Click to copy email"
            className="text-xs text-cold-gray/70 truncate cursor-pointer hover:text-cold-gray transition-colors"
          >
            {user.email}
          </p>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center">
        {user.googleAccount ? (
          <FcGoogle className="text-lg text-red-500" />
        ) : (
          "Email"
        )}
      </div>
      <div className="col-span-1 text-center">{user.wishList?.length || 0}</div>
      <div className={`col-span-1 text-center`}>
        <span
          className={`px-2 py-1 rounded-full ${
            user.isAdmin
              ? "bg-yellow-50 text-yellow-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {user.isAdmin ? "Admin" : "Customer"}
        </span>
      </div>
      <div className="col-span-1">{formatDate(user.createdAt)}</div>
      <div className={`col-span-1 text-center`}>
        <span
          className={`px-2 py-1 rounded-full ${
            user.isBlocked
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {" "}
          {user.isBlocked ? "Blocked" : "Active"}{" "}
        </span>
      </div>

      <div className="col-span-2 flex justify-end items-center gap-2">
        {!user.isAdmin && (
          <Button
            styles="!px-3 !py-2 !capitalize"
            variant="cta"
            action={() => setAdminModal(true)}
            content={
              <>
                <FaUserShield /> Make Admin
              </>
            }
          />
        )}
        <Button
          styles="!px-3 !py-2 !capitalize"
          variant={user.isBlocked ? "cta" : "warning"}
          action={() => setBlockModal(true)}
          content={
            <>
              {user.isBlocked ? <BsUnlockFill /> : <BsLockFill />}
              {user.isBlocked ? "Unblock" : "Block"}
            </>
          }
        />
      </div>

      <ConfirmationModal
        isOpen={blockModal}
        onClose={() => setBlockModal(false)}
        onConfirm={handleToggleBlockUser}
        title={user.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${
          user.isBlocked ? "unblock" : "block"
        } this user? ${
          user.isBlocked
            ? "They will be able to access their account again."
            : "They will not be able to access their account until unblocked."
        }`}
        type={user.isBlocked ? "save" : "warning"}
        confirmText={user.isBlocked ? "Unblock" : "Block"}
        isLoading={isLoading.block}
      />

      <ConfirmationModal
        isOpen={adminModal}
        onClose={() => setAdminModal(false)}
        onConfirm={handleMakeAdmin}
        title="Make Admin"
        message="Are you sure you want to make this user an admin? Admins will have full access to the admin dashboard and all administrative privileges."
        type="update"
        confirmText="Make Admin"
        isLoading={isLoading.admin}
      />
    </div>
  );
};

export default UserItem;
