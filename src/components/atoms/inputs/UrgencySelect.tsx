// src/components/atoms/inputs/UrgencySelect.tsx
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

import {
  FireIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";

export type TicketUrgency = "LOW" | "MEDIUM" | "HIGH";
export type UrgencyFilterValue = TicketUrgency | "ALL";

type UrgencyMode = "input" | "filter";

interface UrgencyOption {
  value: UrgencyFilterValue;
  label: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  hoverBg: string;
  selectedBg: string;
  borderColor: string;
}

export const UrgencySelect: React.FC<{
  mode?: UrgencyMode;
  value: UrgencyFilterValue;
  onChange: (value: UrgencyFilterValue) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  includeAllOption?: boolean;
}> = ({
  mode = "input",
  value,
  onChange,
  placeholder,
  className,
  label,
  includeAllOption = false,
}) => {
  const { t } = useTranslation("tickets");

  const BASE_URGENCY_OPTIONS: UrgencyOption[] = React.useMemo(
    () => [
      {
        value: "LOW",
        label: t("urgencyoptions.options.low.label"),
        description: t("urgency.options.low.description"),
        icon: ClockIcon,
        color: "text-emerald-600",
        hoverBg: "hover:bg-emerald-50",
        selectedBg: "data-[state=checked]:bg-emerald-100",
        borderColor: "border-emerald-500",
      },
      {
        value: "MEDIUM",
        label: t("urgencyoptions.options.medium.label"),
        description: t("urgencyoptions.options.medium.description"),
        icon: ExclamationTriangleIcon,
        color: "text-amber-600",
        hoverBg: "hover:bg-amber-50",
        selectedBg: "data-[state=checked]:bg-amber-100",
        borderColor: "border-amber-500",
      },
      {
        value: "HIGH",
        label: t("urgencyoptions.options.high.label"),
        description: t("urgencyoptions.options.high.description"),
        icon: FireIcon,
        color: "text-red-600",
        hoverBg: "hover:bg-red-50",
        selectedBg: "data-[state=checked]:bg-red-100",
        borderColor: "border-red-500",
      },
    ],
    [t]
  );

  const ALL_OPTION: UrgencyOption = React.useMemo(
    () => ({
      value: "ALL",
      label: t("urgencyoptions.options.all.label"),
      icon: AdjustmentsHorizontalIcon,
      color: "text-slate-500",
      hoverBg: "hover:bg-slate-50",
      selectedBg: "data-[state=checked]:bg-slate-100",
      borderColor: "border-slate-400",
    }),
    [t]
  );

  const isFilterMode = mode === "filter";

  const options = React.useMemo(() => {
    if (isFilterMode && includeAllOption)
      return [ALL_OPTION, ...BASE_URGENCY_OPTIONS];
    return BASE_URGENCY_OPTIONS;
  }, [isFilterMode, includeAllOption, ALL_OPTION, BASE_URGENCY_OPTIONS]);

  const current = options.find((o) => o.value === value);

  const resolvedPlaceholder =
    placeholder ??
    t("urgencyoptions.placeholder", { defaultValue: "Select urgency" });

  return (
    <div className="flex flex-col gap-0.5">
      {label && label.length > 0 && (
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.12em]">
          {label}
        </span>
      )}

      <Select
        value={value}
        onValueChange={(v) => onChange(v as UrgencyFilterValue)}
      >
        <SelectTrigger
          size="sm"
          className={cn(
            "bg-white border-slate-200 shadow-xs w-28",
            isFilterMode
              ? "h-9 px-3 text-xs rounded-lg"
              : "w-full px-3 py-2.5 text-xs rounded-lg",
            "hover:border-oxford-blue-500 focus-visible:ring-oxford-blue-500/40",
            "flex items-center gap-2",
            className
          )}
        >
          {current ? (
            <span className="flex items-center gap-2">
              <current.icon className={cn("h-4 w-4", current.color)} />
              <span className="font-medium">{current.label}</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {resolvedPlaceholder}
            </span>
          )}
        </SelectTrigger>

        <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className={cn(
                "text-xs cursor-pointer px-2 py-2 rounded-md transition-all",
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
                  <span className="font-medium">{opt.label}</span>

                  {!isFilterMode && opt.description && (
                    <span className="text-[10px] text-slate-500">
                      {opt.description}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
