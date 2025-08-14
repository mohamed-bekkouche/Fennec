import type { ILink } from "../NavBar";
import { NavLink } from "react-router-dom";

const NavigationLinks = ({ Links }: { Links: ILink[] }) => {
  return (
    <ul className="max-md:hidden flex items-center gap-5 text-off-black font-normal  uppercase text-sm">
      {Links.map((link, index) => (
        <li
          className="has-[.active]:font-semibold has-[.active]:text-off-black has-[.active]:scale-105 hover:scale-105  hover:font-semibold duration-300  "
          key={index}
        >
          <NavLink to={link.to}>{link.name}</NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavigationLinks;
