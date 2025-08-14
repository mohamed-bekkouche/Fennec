import { NavLink, Outlet } from "react-router-dom";

function Setting() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="p-3 rounded-xs bg-off-black flex gap-2 items-center">
        <button className="bg-primary/20 has-[.active]:bg-primary py-2 px-4 rounded-xs duration-200">
          <NavLink to="wear-styles">Wear Styles</NavLink>
        </button>
        <button className="bg-primary/20 has-[.active]:bg-primary py-2 px-4 rounded-xs duration-200">
          <NavLink to="custimize-suit">Customize Suit</NavLink>
        </button>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Setting;
