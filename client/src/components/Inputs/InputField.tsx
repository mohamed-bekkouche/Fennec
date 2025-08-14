import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface InputFieldProps {
  name: string;
  type?: string;
  label?: string;
  optional?: boolean;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  className?: string;
}

const InputField = ({
  name,
  type = "text",
  placeholder,
  label,
  error,
  register,
  validation,
  optional,
  className = "",
}: InputFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-2 w-full">
      {label && (
        <label className=" capitalize font-medium text-sm" htmlFor={name}>
          {" "}
          {label}{" "}
          {!optional ? (
            <span className="text-red-500">*</span>
          ) : (
            <span> {t("components.inputField.optional")} </span>
          )}{" "}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`w-full border  px-3 py-2.5 rounded-sm placeholder:text-warm-gray/40 ${className} ${error?.message
          ? "border-red-500 focus:border-red-500"
          : "border-warm-gray/40 focus:border-warm-gray"
          }`}
      />

      {error && typeof error.message === "string" && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
