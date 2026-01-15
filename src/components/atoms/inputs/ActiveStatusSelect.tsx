// src/components/atoms/inputs/ActiveStatusSelect.tsx
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { cn } from "../../../lib/utils";

import {
  CheckCircleIcon,
  XCircleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

export type ActiveFilterValue = "ALL" | "true" | "false";
type ActiveMode = "input" | "filter";

interface ActiveOption {
  value: ActiveFilterValue;

  labelKey: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  hoverBg: string;
  selectedBg: string;
  borderColor: string;
}

const ACTIVE_OPTIONS: ActiveOption[] = [
  {
    value: "ALL",
    labelKey: "filters.all",
    icon: AdjustmentsHorizontalIcon,
    color: "text-slate-500",
    hoverBg: "hover:bg-slate-50",
    selectedBg: "data-[state=checked]:bg-slate-100",
    borderColor: "border-slate-400",
  },
  {
    value: "true",
    labelKey: "status.active",
    icon: CheckCircleIcon,
    color: "text-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    selectedBg: "data-[state=checked]:bg-emerald-100",
    borderColor: "border-emerald-500",
  },
  {
    value: "false",
    labelKey: "status.inactive",
    icon: XCircleIcon,
    color: "text-red-600",
    hoverBg: "hover:bg-red-50",
    selectedBg: "data-[state=checked]:bg-red-100",
    borderColor: "border-red-500",
  },
];

interface ActiveStatusSelectProps {
  mode?: ActiveMode; // "input" (form) | "filter" (listado)
  value: ActiveFilterValue;
  onChange: (value: ActiveFilterValue) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const ActiveStatusSelect: React.FC<ActiveStatusSelectProps> = ({
  mode = "filter",
  value,
  onChange,
  placeholder = "Select status",
  className,
  label,
}) => {
  const options = ACTIVE_OPTIONS;
  const current = options.find((o) => o.value === value);
  const isFilterMode = mode === "filter";

  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-0.5">
      {label && label.length > 0 && (
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.12em]">
          {label}
        </span>
      )}

      <Select
        value={value}
        onValueChange={(v) => onChange(v as ActiveFilterValue)}
      >
        <SelectTrigger
          size={"default"}
          className={cn(
            "bg-white border-slate-200 shadow-xs w-32",
            isFilterMode
              ? "h-9 px-3 py-2 text-sm rounded-lg"
              : "w-full px-3 py-2.5 text-sm rounded-lg",
            "hover:border-oxford-blue-500 focus-visible:ring-oxford-blue-500/40",
            "flex items-center gap-2",
            className
          )}
        >
          {current ? (
            <span className="flex items-center gap-2">
              <current.icon className={cn("h-4 w-4", current.color)} />
              <span className="font-medium">{t(current.labelKey)}</span>
            </span>
          ) : (
            <span className="text-sm text-slate-400">
              {placeholder ?? t("filters.selectStatus")}
            </span>
          )}
        </SelectTrigger>

        <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className={cn(
                "text-sm cursor-pointer px-2 py-2 rounded-md transition-all",
                "flex items-start gap-2 text-slate-700",
                opt.hoverBg,
                "hover:pl-3 hover:shadow-sm",
                `hover:border-l-4 ${opt.borderColor}`,
                `data-[state=checked]:border-l-4 ${opt.borderColor}`,
                opt.selectedBg
              )}
            >
              <div className="flex items-start gap-2">
                <opt.icon className={cn("mt-0.5 h-4 w-4", opt.color)} />
                <div className="flex flex-col">
                  <span className="font-medium">{t(opt.labelKey)}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
