import * as React from "react";
import type { FieldError } from "react-hook-form";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils";

type NumberVariant = "integer" | "price";

interface FormInputNumberProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;

  error?: FieldError;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  variant?: NumberVariant;
  placeholder?: string;
  className?: string;
}

export const FormInputNumber: React.FC<FormInputNumberProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  disabled = false,
  min,
  max,
  step,
  variant = "integer",
  placeholder,
  className,
}) => {
  const hasError = !!error;
  const defaultStep = step ?? (variant === "price" ? 0.1 : 1);

  // Estado local para edición libre del campo
  const [inputValue, setInputValue] = React.useState<string>("");

  // Sincronizamos el valor externo con el string del input
  React.useEffect(() => {
    if (Number.isNaN(value)) {
      setInputValue("");
      return;
    }
    if (variant === "price") {
      setInputValue(value.toFixed(2));
    } else {
      setInputValue(Math.round(value).toString());
    }
  }, [value, variant]);

  const clampValue = (val: number) => {
    let newValue = val;
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    return newValue;
  };

  const handleMinus = () => {
    const raw = Number.isNaN(value) ? 0 : value;
    let newValue = raw - defaultStep;
    newValue = clampValue(newValue);
    onChange(Number(newValue.toFixed(2)));
  };

  const handlePlus = () => {
    const raw = Number.isNaN(value) ? 0 : value;
    let newValue = raw + defaultStep;
    newValue = clampValue(newValue);
    onChange(Number(newValue.toFixed(2)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const normalized = inputValue.replace(",", ".");
    const parsed = Number(normalized);

    if (!Number.isNaN(parsed)) {
      const clamped = clampValue(parsed);
      onChange(Number(clamped.toFixed(2)));
    } else {
      // restaurar el valor previo si el texto no es válido
      if (Number.isNaN(value)) {
        setInputValue("");
      } else if (variant === "price") {
        setInputValue(value.toFixed(2));
      } else {
        setInputValue(Math.round(value).toString());
      }
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

      {/* Wrapper del campo numérico */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm",
          "bg-white shadow-xs transition-all",
          "focus-within:ring-2 focus-within:ring-oxford-blue-500/40 focus-within:border-oxford-blue-500",
          hasError &&
            "border-red-400 focus-within:ring-red-500/30 focus-within:border-red-500 bg-red-50/40",
          !hasError && "border-slate-300",
          className
        )}
      >
        {/* Input de texto para editar el número */}
        <input
          id={name}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400",
            "border-none focus:outline-none",
            "mr-2"
          )}
          aria-invalid={hasError ? "true" : "false"}
          inputMode={variant === "price" ? "decimal" : "numeric"}
          pattern={variant === "price" ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
        />

        {/* Botones + / - */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleMinus}
            disabled={disabled}
            className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handlePlus}
            disabled={disabled}
            className="h-6 w-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {hasError && (
        <p className="text-[11px] text-red-500 mt-0.5">{error?.message}</p>
      )}
    </div>
  );
};
