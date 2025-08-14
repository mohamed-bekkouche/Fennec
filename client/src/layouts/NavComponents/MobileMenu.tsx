import { motion, AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import type { ILink } from "../NavBar";
import { NavLink } from "react-router-dom";

interface IMobileMenuProps {
  links: ILink[];
  showLinks: boolean;
  setShowLinks: Dispatch<SetStateAction<boolean>>;
}

const MobileMenu = ({ links, showLinks, setShowLinks }: IMobileMenuProps) => {
  return (
    <AnimatePresence>
      {showLinks && (
        <motion.ul
          variants={{
            initial: { translateX: "110%" },
            animate: { translateX: 0 },
          }}
          initial="initial"
          animate={showLinks ? "animate" : "initial"}
          exit="initial"
          transition={{
            duration: 0.2,
            delay: 0.05,
            ease: "easeOut",
          }}
          className="sm:hidden absolute duration-200 bottom-0 translate-y-full start-0 w-full h-[calc(100dvh-52px)] z-40 bg-off-black/95 flex flex-col "
        >
          {links.map((link, index) => (
            <li
              className="w-full flex-1 max-h-28 text-center text-off-white text-xl flex items-center justify-center border-off-white border-b-[0.5px] first-of-type:border-t-[0.5px]"
              key={index}
              onClick={() => setShowLinks(!showLinks)}
            >
              <NavLink to={link.to}>{link.name}</NavLink>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
