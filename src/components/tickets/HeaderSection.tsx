import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { Ticket } from "../../types/tickets";
import {
  priorityLabel,
  priorityStyles,
  statusLabel,
  statusStyles,
} from "../../pages/tickets/ticketslabel";

interface HeaderSectionProps {
  ticket: Ticket;
  onBack: () => void;
}

export const HeaderSection = ({ ticket, onBack }: HeaderSectionProps) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 rounded-full hover:border
           px-3 py-1 text-sm font-semibold text-slate-600
          hover:border-oxford-blue-300 hover:text-oxford-blue-700"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </button>

      <div>
        <h1 className="text-lg  font-varien-italic  font-semibold text-oxford-blue-800">
          {ticket.title}
        </h1>
        <p className="text-xs text-slate-500">
          Ticket <span className="font-mono font-medium">#{ticket.id}</span>
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
      {/* Estado actual */}
      <span
        className={`
          inline-flex items-center gap-1 rounded-full border px-3 py-1
          text-[11px] font-medium
          ${statusStyles[ticket.status]}
        `}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {statusLabel[ticket.status]}
      </span>

      {/* Prioridad */}
      <span
        className={`
          inline-flex items-center gap-1 rounded-full border px-3 py-1
          text-[11px] font-medium
          ${priorityStyles[ticket.urgency]}
        `}
      >
        <ExclamationTriangleIcon className="h-3.5 w-3.5" />
        Priority: {priorityLabel[ticket.urgency]}
      </span>
    </div>
  </div>
);
