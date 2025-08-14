import { Controller, type UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

export interface CodeFormValues {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
}

interface CodeInputProps {
  form: UseFormReturn<CodeFormValues>;
  onChange?: (code: string) => void;
}

const CodeInput = ({ form, onChange }: CodeInputProps) => {
  const {
    control,
    setFocus,
    watch,
    formState: { errors },
  } = form;

  const fields = ["code1", "code2", "code3", "code4"] as const;

  useEffect(() => {
    const subscription = watch((values) => {
      const code = Object.values(values).join("");
      if (onChange) onChange(code);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div dir="ltr" className="flex justify-center items-center gap-3 mb-1">
      {fields.map((field, index) => (
        <Controller
          key={field}
          name={field}
          control={control}
          rules={{
            required: "Required",
            pattern: {
              value: /^[0-9]$/,
              message: "Only digits",
            },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const input = e.target.value.slice(-1);
                onChange(input);
                if (input && index < fields.length - 1) {
                  setFocus(fields[index + 1]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !value && index > 0) {
                  setFocus(fields[index - 1]);
                }
              }}
              ref={ref}
              className={`w-10 h-10 text-center text-xl font-bold border rounded-lg transition-all
                ${
                  errors[field]
                    ? "border-red-500"
                    : "border-warm-gray/50 focus:border-warm-gray"
                }`}
              maxLength={1}
              inputMode="numeric"
            />
          )}
        />
      ))}
    </div>
  );
};

export default CodeInput;
