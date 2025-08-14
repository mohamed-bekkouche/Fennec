import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to={"/"}
      className="font-the-seasons font-bold w-fit block relative h-fit"
    >
      <p className="uppercase text-2xl tracking-wide font-bold"> Fennec </p>
      <p className="absolute end-0 bottom-0 translate-1/2 text-amber-500 text-sm">
        Wear
      </p>
    </Link>
  );
}

export default Logo;
