import { LuLoaderCircle } from "react-icons/lu";

interface IButtonProps {
  content: any;
  styles?: string;
  action?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "submit" | "button" | "reset";
  variant?: "cta" | "warning" | "delete" | "success" | "info" | "secondary";
}

const Button = ({
  content,
  action,
  styles,
  type,
  disabled,
  variant = "cta",
  loading = false,
}: IButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "cta":
        return "bg-primary text-white shadow-[0_4px_6px_-1px_#488aec31,_0_2px_4px_-1px_#488aec17] hover:shadow-[0_10px_15px_-3px_#488aec4f,_0_4px_6px_-2px_#488aec17] hover:bg-primary/90";

      case "warning":
        return "bg-orange-500 text-white shadow-[0_4px_6px_-1px_#f97316a1,_0_2px_4px_-1px_#f97316a1] hover:shadow-[0_5px_15px_-3px_#f97316a1,_0_4px_6px_-2px_#f97316a1] hover:bg-orange-600";

      case "delete":
        return "bg-red-500 text-white shadow-[0_2px_3px_-1px_#ef4444a1,_0_2px_4px_-1px_#ef4444a1] hover:shadow-[0_5px_7.5px_-2px_#ef4444a1,_0_2px_3px_-2px_#ef4444a1] hover:bg-red-600";

      case "success":
        return "bg-green-500 text-white shadow-[0_4px_6px_-1px_#22c55ea1,_0_2px_4px_-1px_#22c55ea1] hover:shadow-[0_10px_15px_-3px_#22c55ea1,_0_4px_6px_-2px_#22c55ea1] hover:bg-green-600";

      case "info":
        return "bg-blue-500 text-white shadow-[0_4px_6px_-1px_#3b82f6a1,_0_2px_4px_-1px_#3b82f6a1] hover:shadow-[0_10px_15px_-3px_#3b82f6a1,_0_4px_6px_-2px_#3b82f6a1] hover:bg-blue-600";

      case "secondary":
        return "bg-cold-gray/50 text-white shadow-[0_2px_3px_-1px_#6b7280a1,_0_2px_4px_-1px_#6b7280a1] hover:shadow-[0_5px_7.5px_-2px_#6b7280a1,_0_2px_3px_-2px_#6b7280a1] hover:bg-cold-gray/40";

      default:
        return "bg-primary text-white shadow-[0_4px_6px_-1px_#488aec31,_0_2px_4px_-1px_#488aec17] hover:shadow-[0_10px_15px_-3px_#488aec4f,_0_4px_6px_-2px_#488aec17]";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => action && action()}
      className={`flex justify-center items-center gap-2 py-2.5 px-5 text-xs leading-5 font-bold cursor-pointer uppercase border-none rounded-sm select-none duration-500 ease-in-out focus:shadow-none focus:opacity-85 active:shadow-none active:opacity-85 ${getVariantStyles()} ${styles} ${
        (disabled || loading) && "opacity-50 cursor-not-allowed"
      }`}
    >
      <>
        {loading ? (
          <LuLoaderCircle className="animate-spin mx-auto" />
        ) : (
          content
        )}
      </>
    </button>
  );
};

export default Button;
