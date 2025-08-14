// import type {
//   FieldError,
//   FieldErrorsImpl,
//   Merge,
//   RegisterOptions,
//   UseFormRegister,
// } from "react-hook-form";
// import { FiSearch } from "react-icons/fi";

// interface InputFieldProps {
//   name: string;
//   type?: string;
//   label?: string;
//   optional?: boolean;
//   placeholder?: string;
//   error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
//   register: UseFormRegister<any>;
//   validation?: RegisterOptions;
//   className?: string;
// }

// const InputField = ({
//   name,
//   type = "text",
//   placeholder,
//   label,
//   error,
//   register,
//   validation,
//   optional,
//   className = "",
// }: InputFieldProps) => {
//   return (
//     <div className="w-full relative text-off-white">
//       {label && (
//         <label className=" capitalize text-sm mb-0.5" htmlFor={name}>
//           {" "}
//           {label}{" "}
//           {!optional ? (
//             <span className="text-red-500">*</span>
//           ) : (
//             <span> (Optional) </span>
//           )}{" "}
//         </label>
//       )}
//       <input
//         id={name}
//         type={type === "search" ? "text" : type}
//         placeholder={placeholder}
//         {...register(name, validation)}
//         className={`w-full mb-2 text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70 appearance-none ${className} ${
//           error?.message && "border border-red-500 focus:border-red-500 !mb-0"
//         }`}
//       />
//       {type === "search" && (
//         <span className=" absolute top-1/2 right-2 text-xl -translate-y-1/2">
//           {" "}
//           <FiSearch />{" "}
//         </span>
//       )}

//       {error && typeof error.message === "string" && (
//         <p className="text-red-500 text-sm mb-2">{error.message}</p>
//       )}
//     </div>
//   );
// };

// export default InputField;

import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { FiSearch } from "react-icons/fi";

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
  addOn?: string; // New prop for adding units/symbols
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
  addOn, // Destructure the new prop
}: InputFieldProps) => {
  return (
    <div className="w-full relative text-off-white">
      {label && (
        <label className=" capitalize text-sm mb-0.5" htmlFor={name}>
          {" "}
          {label}{" "}
          {!optional ? (
            <span className="text-red-500">*</span>
          ) : (
            <span> (Optional) </span>
          )}{" "}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type={type === "search" ? "text" : type}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`w-full text-off-white bg-off-black border border-cold-gray/70 focus:border-cold-gray shadow-xs focus:shadow-lg focus:-translate-y-0.5 shadow-off-white/10 px-3 py-2.5 duration-200 rounded-sm placeholder:text-cold-gray/70 appearance-none ${className} ${
            error?.message && "border border-red-500 focus:border-red-500 !mb-0"
          } ${addOn ? "pr-8" : ""}`}
        />

        {addOn && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cold-gray/70">
            {addOn}
          </span>
        )}
        {type === "search" && (
          <span className="absolute top-1/2 right-2 text-xl -translate-y-1/2">
            <FiSearch />
          </span>
        )}
      </div>

      {error && typeof error.message === "string" && (
        <p className="text-red-500 text-sm mt-2 mb-2">{error.message}</p>
      )}
    </div>
  );
};

export default InputField;
