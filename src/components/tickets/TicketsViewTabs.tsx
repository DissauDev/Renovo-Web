// src/components/tickets/TicketsViewTabs.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../store/store";
import { useAppSelector } from "../../store/hooks";

export type ViewFilter = "ALL" | "PENDING" | "SCHEDULED" | "COMPLETED";

export interface TicketsCounters {
  all: number;
  pending: number;
  scheduled: number;
  completed: number;
}

interface TicketsViewTabsProps {
  viewFilter: ViewFilter;
  onChange: (view: ViewFilter) => void;
  counters: TicketsCounters;
}

const TABS: {
  id: ViewFilter;
  labelkey: string;
  countKey: keyof TicketsCounters;
  // nombre de paleta de color
  color: "slate" | "emerald" | "amber" | "sky" | "zinc" | "indigo";
}[] = [
  { id: "ALL", labelkey: "tabs.all", countKey: "all", color: "slate" },
  {
    id: "PENDING",
    labelkey: "tabs.pending",
    countKey: "pending",
    color: "amber",
  },
  {
    id: "SCHEDULED",
    labelkey: "tabs.scheduled",
    countKey: "scheduled",
    color: "sky",
  },
  {
    id: "COMPLETED",
    labelkey: "tabs.completed",
    countKey: "completed",
    color: "emerald",
  },
];

const COLOR_STYLES: Record<
  "slate" | "emerald" | "amber" | "sky" | "zinc" | "indigo",
  {
    border: string;
    bg: string;
    topBar: string;
    labelkey: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  slate: {
    border: "border-slate-300",
    bg: "bg-slate-50",
    topBar: "bg-slate-400",
    labelkey: "text-slate-800",
    badgeBg: "bg-slate-200",
    badgeText: "text-slate-800",
  },
  indigo: {
    border: "border-indigo-300",
    bg: "bg-indigo-50",
    topBar: "bg-indigo-400",
    labelkey: "text-indigo-800",
    badgeBg: "bg-indigo-200",
    badgeText: "text-indigo-800",
  },
  emerald: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    topBar: "bg-emerald-500",
    labelkey: "text-emerald-800",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  amber: {
    border: "border-amber-300",
    bg: "bg-amber-50",
    topBar: "bg-amber-500",
    labelkey: "text-amber-800",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  sky: {
    border: "border-sky-300",
    bg: "bg-sky-50",
    topBar: "bg-sky-500",
    labelkey: "text-sky-800",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
  },
  zinc: {
    border: "border-zinc-300",
    bg: "bg-zinc-50",
    topBar: "bg-zinc-500",
    labelkey: "text-zinc-800",
    badgeBg: "bg-zinc-100",
    badgeText: "text-zinc-800",
  },
};

export const TicketsViewTabs: React.FC<TicketsViewTabsProps> = ({
  viewFilter,
  onChange,
  counters,
}) => {
  const { t } = useTranslation("tickets");
  const user = useAppSelector((state: RootState) => state.auth.user);

  const tabsToRender =
    user?.role === "EMPLOYEE" ? TABS.filter((t) => t.id !== "PENDING") : TABS;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {tabsToRender.map((tab) => {
          const isActive = viewFilter === tab.id;
          const count = counters[tab.countKey];
          const color = COLOR_STYLES[tab.color];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                relative flex flex-col justify-between
                min-w-[150px]
                rounded-xl border px-4 py-3
                shadow-sm transition-all
                hover:shadow-md
                ${
                  isActive
                    ? `${color.border} ${color.bg}`
                    : "border-slate-200 bg-white"
                }
              `}
            >
              {/* Barra superior del mismo color del tab */}
              <span
                className={`
                  absolute top-0 left-0 right-0 h-0.5 rounded-t-xl
                  ${isActive ? color.topBar : "bg-transparent"}
                `}
              />

              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-[11px] font-semibold uppercase tracking-[0.14em]
                    ${isActive ? color.labelkey : "text-slate-400"}
                  `}
                >
                  {t(tab.labelkey)}
                </span>
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-[11px] font-semibold
                    ${
                      isActive
                        ? `${color.badgeBg} ${color.badgeText}`
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {count}
                </span>
              </div>

              <div className="text-2xl font-semibold text-slate-900">
                {count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
