import * as React from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "../../../lib/utils";

interface FormInputPhoneProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: FieldError;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Usamos forwardRef para que RHF pueda pasar ref correctamente
export const FormInputPhone = React.forwardRef<
  HTMLInputElement,
  FormInputPhoneProps
>(
  (
    { label, name, error, leftIcon, rightIcon, className, onChange, ...props },
    ref
  ) => {
    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value || "";

      // Solo dígitos
      const digits = raw.replace(/\D/g, "").slice(0, 10);

      let formatted = digits;

      if (digits.length > 0 && digits.length <= 3) {
        formatted = `(${digits}`;
      } else if (digits.length > 3 && digits.length <= 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length > 6) {
        formatted = `(${digits.slice(0, 3)}) ${digits.slice(
          3,
          6
        )}-${digits.slice(6)}`;
      }

      e.target.value = formatted;

      // Disparamos el onChange que viene de RHF (register) + cualquier onChange adicional
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        <label
          htmlFor={name}
          className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase"
        >
          {label}
        </label>

        {/* Wrapper del input */}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
            "bg-white shadow-xs transition-all",
            "focus-within:ring-2 focus-within:ring-oxford-blue-500/40 focus-within:border-oxford-blue-500",
            hasError &&
              "border-red-400 focus-within:ring-red-500/30 focus-within:border-red-500 bg-red-50/40",
            !hasError && "border-slate-300",
            className
          )}
        >
          {leftIcon && (
            <span className="text-slate-400 flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            id={name}
            name={name}
            ref={ref}
            inputMode="tel"
            // type="tel" si quieres que en móvil abra teclado numérico
            type="tel"
            className={cn(
              "w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400",
              "border-none focus:outline-none",
              leftIcon || rightIcon ? "flex-1" : ""
            )}
            aria-invalid={hasError ? "true" : "false"}
            onChange={handleChange}
            {...props}
          />

          {rightIcon && (
            <span className="text-slate-400 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Mensaje de error */}
        {hasError && (
          <p className="text-[11px] text-red-500 mt-0.5">{error?.message}</p>
        )}
      </div>
    );
  }
);

FormInputPhone.displayName = "FormInputPhone";
