import useDirection from "../../hooks/useDirection";
import { LuLoaderCircle } from "react-icons/lu";

interface IButtonProps {
  content: any;
  styles?: string;
  action?: () => void;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
}
const Button = ({ content, action, styles, type, disabled }: IButtonProps) => {
  const direction = useDirection();
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => action && action()}
      className={`w-full group relative block border text-white px-1.5 md:px-4 py-2 cursor-pointer delay-100 duration-100 overflow-hidden bg-off-black border-primary hover:text-off-black ${styles} ${disabled ? "opacity-80" : ""
        } `}
    >
      <span
        className={`block top-0 start-0 bg-off-white absolute w-full h-full duration-300 ${direction === "rtl"
          ? "-translate-x-full group-hover:translate-x-0"
          : "-translate-x-full group-hover:translate-x-0"
          }`}
      />
      <span className="relative block text-nowrap">
        {disabled ? (
          <LuLoaderCircle className="animate-spin mx-auto" />
        ) : (
          content
        )}{" "}
      </span>
    </button>
  );
};

export default Button;
