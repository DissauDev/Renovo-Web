import * as React from "react";
import { cn } from "../../../lib/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  variant?: "integer" | "price";
  placeholder?: string;
  className?: string;
}

export const InputNumber = ({
  value,
  onChange,
  disabled = false,
  min,
  max,
  step,
  variant = "integer",
  placeholder,
  className,
}: InputNumberProps) => {
  const defaultStep = step ?? (variant === "price" ? 0.1 : 1);

  // Estado local para edición libre del campo
  const [inputValue, setInputValue] = React.useState<string>("");

  React.useEffect(() => {
    // Sincronizar valor externo con el input local (al cambiar desde fuera)
    setInputValue(
      variant === "price" ? value.toFixed(2) : Math.round(value).toString()
    );
  }, [value, variant]);

  const handleMinus = () => {
    let newValue = value - defaultStep;
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    onChange(Number(newValue.toFixed(2)));
  };

  const handlePlus = () => {
    let newValue = value + defaultStep;
    if (min !== undefined && newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;
    onChange(Number(newValue.toFixed(2)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = Number(inputValue.replace(",", "."));
    if (!isNaN(parsed)) {
      let newValue = parsed;
      if (min !== undefined && newValue < min) newValue = min;
      if (max !== undefined && newValue > max) newValue = max;
      onChange(Number(newValue.toFixed(2)));
    } else {
      // Restaurar al valor anterior si input no válido
      setInputValue(
        variant === "price" ? value.toFixed(2) : Math.round(value).toString()
      );
    }
  };

  return (
    <div
      className={cn(
        "flex items-stretch h-9 rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "min-w-0 grow bg-transparent px-2 outline-none text-base md:text-sm placeholder:text-muted-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        inputMode={variant === "price" ? "decimal" : "numeric"}
        pattern={variant === "price" ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
      />
      <div className="shrink-0 flex items-center space-x-1">
        <button
          type="button"
          className="h-7 w-7 text-muted-foreground text-sapphire-300"
          disabled={disabled || parseFloat(inputValue) === 0}
          onClick={handleMinus}
        >
          <MinusIcon className="size-14" />
        </button>
        <button
          type="button"
          className="h-7 w-7 text-muted-foreground text-sapphire-300"
          disabled={disabled}
          onClick={handlePlus}
        >
          <PlusIcon className="size-14" />
        </button>
      </div>
    </div>
  );
};

InputNumber.displayName = "InputNumber";
