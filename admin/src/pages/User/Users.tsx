import { useForm } from "react-hook-form";
import InputField from "../../components/Inputs/InputField";
import UserItem from "../../components/Users/UserItem";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";
import type { IUser } from "../../types/User";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const { register, watch } = useForm<{
    isBlocked: string | null;
    username: string | null;
    sortBy: "createdAt" | "username" | "email";
    order: "asc" | "desc";
  }>({
    defaultValues: {
      isBlocked: null,
      username: null,
      sortBy: "createdAt",
      order: "desc",
    },
  });

  const { isBlocked, username, sortBy, order } = watch();

  const fetchUsers = async (params = {}) => {
    try {
      const { data } = await getUsers(params);
      setUsers(data.users);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    }
  };

  function onToggleBlock(userId: string, block: boolean) {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, isBlocked: !block } : user
      )
    );
  }

  function onMakeAdmin(userId: string) {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, isAdmin: true } : user
      )
    );
  }

  useEffect(() => {
    fetchUsers({
      username,
      sortBy,
      isBlocked,
      page: currentPage,
      limit,
      order,
    });
  }, [username, sortBy, isBlocked, order, currentPage, limit]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="bg-off-black p-3 rounded-sm flex items-center justify-between">
        <div className="flex w-sm items-center gap-4">
          <InputField
            name="username"
            placeholder="Search For User..."
            type="search"
            register={register}
            className="focus:!translate-y-0 !py-2 !mb-0"
          />
        </div>
        <div className="flex gap-3 items-center">
          <select
            id="isBlocked"
            {...register("isBlocked")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="">All Users</option>
            <option value="false">Active Users</option>
            <option value="true">Blocked Users</option>
          </select>

          <select
            {...register("sortBy")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="username">Sort by Username</option>
            <option value="email">Sort by Email</option>
          </select>

          <select
            {...register("order")}
            className="border py-[9px] text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-2 rounded-sm  outline-none cursor-pointer"
          >
            <option value="asc"> Ascending </option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="flex-1 h-full w-full bg-off-black overflow-hidden p-2 pb-0 rounded-sm flex flex-col">
        <div className="grid grid-cols-10 gap-4 text-cold-gray/70 text-xs uppercase tracking-wide mb-3">
          <div className="col-span-3">User</div>
          <div className="col-span-1 text-center">Account</div>
          <div className="col-span-1 text-center">Wishlist</div>
          <div className="col-span-1 text-center">Admin</div>
          <div className="col-span-1">Created At</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-end">Actions</div>
        </div>

        <div className="w-full flex-1 overflow-scroll">
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              onMakeAdmin={onMakeAdmin}
              onToggleBlock={onToggleBlock}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Users;
