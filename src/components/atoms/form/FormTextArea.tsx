import * as React from "react";
import type { TextareaHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "../../../lib/utils";

interface FormTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: FieldError;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  name,
  error,
  className,
  rows = 4,
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label
        htmlFor={name}
        className="text-xs font-medium text-slate-600 tracking-[0.12em] uppercase"
      >
        {label}
      </label>

      <div
        className={cn(
          "rounded-lg border px-3 py-2 text-sm bg-white shadow-xs transition-all",
          "focus-within:ring-2 focus-within:ring-oxford-blue-5000/40 focus-within:border-oxford-blue-500",
          hasError &&
            "border-red-400 focus-within:ring-red-500/30 focus-within:border-red-500 bg-red-50/40",
          !hasError && "border-slate-300",
          className
        )}
      >
        <textarea
          id={name}
          name={name}
          rows={rows}
          className={cn(
            "w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 resize-none",
            "border-none focus:outline-none"
          )}
          aria-invalid={hasError ? "true" : "false"}
          {...props}
        />
      </div>

      {hasError && (
        <p className="text-[11px] text-red-500 mt-0.5">{error?.message}</p>
      )}
    </div>
  );
};
