import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface SelectFieldProps {
  name: string;
  label?: string;
  noValue?: string;
  options: { _id: string; name: string }[];
  optional?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  className?: string;
}

const SelectField = ({
  name,
  label,
  options,
  optional = true,
  error,
  register,
  validation,
  noValue,
  className = "",
}: SelectFieldProps) => {
  return (
    <div className="mb-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-0.5"
        >
          {label}
          {!optional && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        {...register(name, validation)}
        className={`w-full border  px-3 py-2.5 rounded-sm text-warm-gray/50 focus:text-warm-gray placeholder:text-warm-gray/40 focus:outline-none ${
          error?.message
            ? "border-red-500 focus:border-red-500"
            : "border-warm-gray/40 focus:border-warm-gray"
        } ${className}`}
      >
        {noValue && <option value="">{noValue}</option>}
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>

      {error && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default SelectField;
