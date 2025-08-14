import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to={"/"}
      className="font-the-seasons font-bold w-fit block relative h-fit"
    >
      <p className="uppercase text-xl tracking-wide text-off-black font-bold">
        {" "}
        Fennec{" "}
      </p>
      <p className="absolute right-0 bottom-0 translate-1/2 text-amber-500 text-xs md:text-sm">
        Wear
      </p>
    </Link>
  );
}

export default Logo;
