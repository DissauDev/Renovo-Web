import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "../../../lib/utils";

export interface StatusOption {
  value: string;
  label: string;

  dotClassName?: string;
}

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];

  // UI
  placeholder?: string;
  className?: string; // extra para el Trigger
  label?: string; // label opcional (para modo filtro/form)
  wrapperClassName?: string; // extra para el contenedor
  labelClassName?: string; // extra para la etiqueta

  // Opción "All"
  includeAllOption?: boolean;
  allLabel?: string;
  allValue?: string;
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
  label,
  wrapperClassName,
  labelClassName,
  includeAllOption = false,
  allLabel = "All",
  allValue = "ALL",
}) => {
  const current = options.find((o) => o.value === value);

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-30", wrapperClassName)}>
      {label && (
        <span
          className={cn(
            "text-[10px] font-medium text-slate-500 tracking-[0.12em] uppercase",
            labelClassName
          )}
        >
          {label}
        </span>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          size="sm"
          className={cn(
            "bg-white/90 text-xs rounded-lg min-w-30 border shadow-xs",
            "flex items-center gap-2 h-9 px-3",
            "border-slate-200",
            "hover:border-oxford-blue-400",
            "focus-visible:ring-oxford-blue-500/40 focus-visible:border-oxford-blue-500",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {current?.dotClassName && (
              <span
                className={cn("h-2 w-2 rounded-full", current.dotClassName)}
              />
            )}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md">
          {/* Opción "All" opcional */}
          {includeAllOption && (
            <SelectItem
              value={allValue}
              className={cn(
                "text-xs cursor-pointer px-2 py-2 rounded-md transition-all",
                "flex items-center gap-2",
                "text-slate-700",
                "hover:bg-slate-50 hover:text-slate-800 hover:pl-3 hover:shadow-sm"
              )}
            >
              <span>{allLabel}</span>
            </SelectItem>
          )}

          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className={cn(
                "text-xs cursor-pointer px-2 py-2 rounded-md transition-all",
                "flex items-center gap-2",
                "text-slate-700",
                // hover mejorado
                "hover:bg-emerald-50 hover:text-oxford-blue-700 hover:pl-3 hover:shadow-sm",
                // borde izquierdo suave cuando haces hover
                "hover:border-l-4 hover:border-oxford-blue-500",
                // al estar seleccionado
                "data-[state=checked]:bg-oxford-blue-100 data-[state=checked]:text-oxford-blue-800 data-[state=checked]:border-l-4 data-[state=checked]:border-oxford-blue-600"
              )}
            >
              {opt.dotClassName && (
                <span
                  className={cn("h-2 w-2 rounded-full", opt.dotClassName)}
                />
              )}
              <span>{opt.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
