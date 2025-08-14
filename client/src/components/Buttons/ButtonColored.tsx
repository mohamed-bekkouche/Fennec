import { LuLoaderCircle } from "react-icons/lu";

interface IButtonProps {
  content: any;
  styles?: string;
  action?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "submit" | "button" | "reset";
  variant?: "cta" | "warning" | "delete" | "success" | "secondary";
}

const ButtonColored = ({
  content,
  action,
  styles,
  type = "button",
  disabled,
  variant = "cta",
  loading = false,
}: IButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "cta":
        return "bg-blue-600 text-white shadow-[0_2px_3px_-1px_#2563eba1,_0_2px_4px_-1px_#2563eba1] hover:shadow-[0_5px_7.5px_-2px_#2563eba1,_0_2px_3px_-2px_#2563eba1] hover:bg-blue-700";

      case "warning":
        return "bg-orange-600 text-white shadow-[0_4px_6px_-1px_#ea580ca1,_0_2px_4px_-1px_#ea580ca1] hover:shadow-[0_5px_7.5px_-2px_#ea580ca1,_0_4px_6px_-2px_#ea580ca1] hover:bg-orange-700";

      case "delete":
        return "bg-red-600 text-white shadow-[0_2px_3px_-1px_#dc2626a1,_0_2px_4px_-1px_#dc2626a1] hover:shadow-[0_5px_7.5px_-2px_#dc2626a1,_0_2px_3px_-2px_#dc2626a1] hover:bg-red-700";

      case "success":
        return "bg-green-600 text-white shadow-[0_2px_3px_-1px_#16a34aa1,_0_2px_4px_-1px_#16a34aa1] hover:shadow-[0_5px_7.5px_-2px_#16a34aa1,_0_2px_3px_-2px_#16a34aa1] hover:bg-green-700";

      case "secondary":
        return "bg-gray-600 text-white shadow-[0_2px_3px_-1px_#4b5563a1,_0_2px_4px_-1px_#4b5563a1] hover:shadow-[0_5px_7.5px_-2px_#4b5563a1,_0_2px_3px_-2px_#4b5563a1] hover:bg-gray-700";

      default:
        return "bg-blue-600 text-white shadow-[0_2px_3px_-1px_#2563eba1,_0_2px_4px_-1px_#2563eba1] hover:shadow-[0_5px_7.5px_-2px_#2563eba1,_0_2px_3px_-2px_#2563eba1] hover:bg-blue-700";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => action && action()}
      className={`flex justify-center items-center gap-2 py-2.5 px-5 text-sm leading-5 font-bold cursor-pointer uppercase border-none rounded-sm select-none duration-500 ease-in-out focus:shadow-none focus:opacity-85 active:shadow-none active:opacity-85 ${getVariantStyles()} ${styles} ${
        (disabled || loading) && "opacity-50 cursor-not-allowed"
      }`}
    >
      {loading ? <LuLoaderCircle className="animate-spin mx-auto" /> : content}
    </button>
  );
};

export default ButtonColored;
