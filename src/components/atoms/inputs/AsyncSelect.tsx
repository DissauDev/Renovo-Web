import * as React from "react";
import type { FieldError } from "react-hook-form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

export type UseOptionsHook<T> = () => {
  data?: T[];
  isLoading: boolean;
  isError: boolean;
};

type AsyncSelectMode = "input" | "filter";

interface AsyncSelectProps<T> {
  label?: string;
  name: string;
  error?: FieldError;
  placeholder?: string;
  value?: string;
  useLabel?: boolean;
  onChange?: (value: string) => void;
  filterOptions?: (options: T[]) => T[];
  useOptionsHook: UseOptionsHook<T>;
  getOptionLabel: (item: T) => string;
  getOptionValue: (item: T) => string;

  enableSearch?: boolean;

  // estilos
  mode?: AsyncSelectMode; // "input" (form) | "filter" (filtros)
  className?: string; // extra para el Trigger
  wrapperClassName?: string; // extra para el div exterior
  labelClassName?: string; // extra para el label
  includeAllOption?: boolean;
}

export function AsyncSelect<T>({
  label,
  name,
  error,
  placeholder = "Select an option",
  value,
  onChange,
  useOptionsHook,
  getOptionLabel,
  getOptionValue,
  enableSearch = false,
  mode = "input",
  filterOptions,
  className,
  includeAllOption = false,
  wrapperClassName,
  useLabel = true,
  labelClassName,
}: AsyncSelectProps<T>) {
  const hasError = !!error;
  const { data, isLoading, isError } = useOptionsHook();

  const [search, setSearch] = React.useState("");

  const options = React.useMemo(() => {
    const base = data ?? [];
    return filterOptions ? filterOptions(base) : base;
  }, [data, filterOptions]);

  const filteredOptions = React.useMemo(() => {
    if (!enableSearch || !search.trim()) return options;
    const term = search.toLowerCase();
    return options.filter((item) =>
      getOptionLabel(item).toLowerCase().includes(term)
    );
  }, [options, search, enableSearch, getOptionLabel]);

  const isFilterMode = mode === "filter";
  const { t } = useTranslation("common");

  return (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {/* Label */}
      {useLabel && (
        <label
          htmlFor={name}
          className={cn(
            isFilterMode
              ? "text-[10px] font-medium text-slate-500 tracking-[0.12em] uppercase"
              : "text-xs font-medium text-slate-600 tracking-[0.12em] uppercase",
            labelClassName
          )}
        >
          {label}
        </label>
      )}

      {/* Select */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={name}
          size="default"
          className={cn(
            "bg-white/90 text-sm rounded-lg border shadow-xs",
            "flex justify-between items-center",
            // tamaños según modo
            isFilterMode ? "h-9 px-3 min-w-40" : "w-full px-3 py-2.5",
            // estados base
            !hasError && "border-slate-200",
            // hover / focus elegantes
            "hover:border-oxford-blue-400",
            "focus-visible:ring-oxford-blue-500/40 focus-visible:border-oxford-blue-500",
            // estado error
            hasError &&
              "border-red-400 bg-red-50/60 focus-visible:ring-red-500/40 focus-visible:border-red-500",
            className
          )}
        >
          <SelectValue
            placeholder={
              isLoading
                ? t("asyncSelect.loading")
                : isError
                ? t("asyncSelect.error")
                : placeholder
            }
          />
        </SelectTrigger>

        <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md">
          {/* Barra de búsqueda opcional */}
          {enableSearch && (
            <div className="px-2 py-1.5 sticky top-0 bg-white border-b border-slate-100">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("asyncSelect.searchPlaceholder")}
                className="w-full rounded-md border border-slate-200
              
                 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-oxford-blue-500"
              />
            </div>
          )}

          {/* Estados de carga / error / vacío */}
          {isLoading && (
            <SelectItem
              value="__loading"
              disabled
              className="text-xs text-slate-500 cursor-default"
            >
              {t("asyncSelect.loadingLower")}
            </SelectItem>
          )}

          {isError && !isLoading && (
            <SelectItem
              value="__error"
              disabled
              className="text-xs text-red-500 cursor-default"
            >
              {t("asyncSelect.errorLower")}
            </SelectItem>
          )}

          {!isLoading && !isError && filteredOptions.length === 0 && (
            <SelectItem
              value="__empty"
              disabled
              className="text-xs text-slate-500 cursor-default"
            >
              {t("asyncSelect.empty")}
            </SelectItem>
          )}

          {/* 🔥 NUEVO: opción "All" solo en modo filtro */}
          {!isLoading && !isError && isFilterMode && includeAllOption && (
            <SelectItem
              value={"ALL"}
              className={cn(
                "text-xs cursor-pointer px-2 py-2 rounded-md transition-all",
                "flex items-center gap-2",
                "text-slate-700",
                "hover:bg-slate-50 hover:text-slate-800 hover:pl-3 hover:shadow-sm"
              )}
            >
              {t("filters.all")}
            </SelectItem>
          )}

          {/* Opciones reales */}
          {!isLoading &&
            !isError &&
            filteredOptions.map((item, idx) => {
              const val = getOptionValue(item);
              const optionLabel = getOptionLabel(item);
              return (
                <SelectItem
                  key={val ?? idx}
                  value={val}
                  className={cn(
                    "text-xs cursor-pointer px-2 py-2 rounded-md transition-all",
                    "flex items-center gap-2",
                    "text-slate-700",
                    // hover bonito
                    "hover:bg-oxford-blue-50 hover:text-oxford-blue-700 hover:pl-3 hover:shadow-sm",
                    "hover:border-l-4 hover:border-oxford-blue-500",
                    // seleccionado
                    "data-[state=checked]:bg-oxford-blue-100 data-[state=checked]:text-oxford-blue-800",
                    "data-[state=checked]:border-l-4 data-[state=checked]:border-oxford-blue-600"
                  )}
                >
                  <span>{optionLabel}</span>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>

      {/* Error */}
      {hasError && !isFilterMode && (
        <p className="text-[11px] text-red-500 mt-0.5">{error?.message}</p>
      )}
    </div>
  );
}
