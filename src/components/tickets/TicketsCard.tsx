import {
  MapPinIcon,
  UserCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { Ticket, TicketStatus } from "../../types/tickets";
import { useTranslation } from "react-i18next";

const statusLabelKey: Record<TicketStatus, string> = {
  PENDING: "status.PENDING",
  CANCELLED: "status.CANCELLED",
  EN_ROUTE: "status.EN_ROUTE",
  ON_SITE: "status.ON_SITE",
  SCHEDULED: "status.SCHEDULED",
  COMPLETED: "status.COMPLETED",
};

const statusStyles: Record<TicketStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  EN_ROUTE: "bg-blue-50 text-blue-700 border-blue-100",
  ON_SITE: "bg-indigo-50 text-indigo-700 border-indigo-100",
  CANCELLED: "bg-red-50 text-purple-700 border-red-100",
  SCHEDULED: "bg-sky-50 text-sky-700 border-sky-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}
export type UrgencyFilterValue = "LOW" | "MEDIUM" | "HIGH";
interface UrgencyOption {
  value: UrgencyFilterValue;
  labelKey: string;
  descKey?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string; // text-red-500, text-amber-500, text-emerald-500, etc.
  hoverBg: string;
  selectedBg: string;
  borderColor: string;
}

const BASE_URGENCY_OPTIONS: UrgencyOption[] = [
  {
    value: "LOW",
    labelKey: "urgency.LOW.label",
    descKey: "urgency.LOW.desc",
    icon: ClockIcon,
    color: "text-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    selectedBg: "data-[state=checked]:bg-emerald-100",
    borderColor: "border-emerald-500",
  },
  {
    value: "MEDIUM",
    labelKey: "urgency.MEDIUM.label",
    descKey: "urgency.MEDIUM.desc",
    icon: ExclamationTriangleIcon,
    color: "text-amber-600",
    hoverBg: "hover:bg-amber-50",
    selectedBg: "data-[state=checked]:bg-amber-100",
    borderColor: "border-amber-500",
  },
  {
    value: "HIGH",
    labelKey: "urgency.HIGH.label",
    descKey: "urgency.HIGH.desc",
    icon: FireIcon,
    color: "text-red-600",
    hoverBg: "hover:bg-red-50",
    selectedBg: "data-[state=checked]:bg-red-100",
    borderColor: "border-red-500",
  },
];
export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const { t } = useTranslation("tickets");
  const providerName = ticket.provider?.name ?? "";
  const laborMinutes = ticket.laborMinutes ?? 0;
  const technicianInitials = ticket.employee?.name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  const urgencyConfig = BASE_URGENCY_OPTIONS.find(
    (opt) => opt.value === ticket.urgency,
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="
      relative
        group text-left
        w-full h-full
        bg-white
        border border-slate-200
        rounded-2xl
        shadow-sm
        hover:shadow-md
        hover:border-green-200
        transition-all duration-150"
    >
      {/* Top row */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1 ">
          {urgencyConfig && (
            <urgencyConfig.icon className={`h-5 w-5 ${urgencyConfig.color}`} />
          )}
          <div className="flex ">
            <span className="text-xs font-semibold text-slate-700">
              T-#{ticket.id}
            </span>
          </div>
        </div>

        <span
          className={`
    inline-flex items-center gap-1
    absolute  right-0      /* 👈 sale un poco por arriba y hacia dentro */
    border px-3 py-1
    text-[11px] font-medium
    rounded-l-full                 /* 👈 aquí mejor pill completa */
    shadow-md shadow-black/10    /* 👈 sombra para que flote */
    bg-white/90 backdrop-blur-sm /* 👈 efecto cristal, opcional */
    ${statusStyles[ticket.status]}
  `}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {t(statusLabelKey[ticket.status])}
        </span>
      </div>

      {/* Title & description */}
      <div className="px-4 py-1">
        <h3 className="text-sm font-varien text-oxford-blue-900 line-clamp-2">
          {ticket.title}
        </h3>
        <h3 className="text-sm font-medium text-slate-800 line-clamp-2 flex items-center">
          <WrenchScrewdriverIcon className="size-3.5 text-slate-400 mr-1" />{" "}
          {ticket.category?.name}
        </h3>
        {ticket.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {ticket.description}
          </p>
        )}
      </div>

      {/* Meta info */}
      <div className="px-4 mt-2 space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="h-3.5 w-3.5 text-slate-400" />
          <span className="line-clamp-1">{ticket.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {t("card.created")}
            {":"}
            <span className="text-slate-700">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </span>
        </div>
        {laborMinutes !== null && laborMinutes > 0 && (
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {t("card.duration")}
              {":"}{" "}
              <span className="text-slate-700">
                {laborMinutes} {t("card.minutes", "min")}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 mt-2 flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/60">
        {/* Cliente */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium font-varien text-slate-400">
            {t("card.client")} {":"}
          </span>
          <span className="text-xs font-semibold text-slate-800">
            {ticket.clientName}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium font-varien text-slate-400">
            {t("card.provider")} {":"}
          </span>
          <span className="text-xs font-semibold text-slate-800">
            {providerName || "—"}
          </span>
        </div>

        {/* Técnico asignado */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            {technicianInitials ?? <UserCircleIcon className="h-5 w-5" />}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-varien text-slate-400">
              {t("card.technician")}
              {":"}
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {ticket.employee?.name ?? t("card.unassigned")}
            </span>
          </div>
        </div>
      </div>

      {/* Borde verde en hover */}
      <div className="h-0.5 w-full bg-linear-to-r from-emerald-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
