// src/components/filters/FilterSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // 👈 ajusta la ruta según donde tengas tu shadcn Select
import { cn } from "../../lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label?: string; // texto pequeño al lado ("Departamento", "Estado"...)
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string; // estilos extra para el wrapper
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {label && (
        <span className="hidden text-[11px] text-slate-500 md:inline">
          {label}
        </span>
      )}

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          size="sm"
          className="
            border-slate-300 bg-white/90 text-xs
            rounded-lg px-3
            shadow-xs
            hover:border-oxford-blue-400
            focus-visible:ring-oxford-blue-500/40
            focus-visible:border-oxford-blue-500
          "
        >
          <SelectValue placeholder={placeholder ?? label} />
        </SelectTrigger>

        <SelectContent
          className="
            bg-white
            border border-slate-200
            shadow-md
            rounded-md
          "
        >
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="
                text-xs
                hover:bg-oxford-blue-50
                cursor-pointer
              "
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
