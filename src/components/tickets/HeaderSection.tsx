import {
  ExclamationTriangleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import type { Ticket } from "../../types/tickets";
import { priorityStyles, statusStyles } from "../../pages/tickets/ticketslabel";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ButtonBack } from "../layout/ButtonBack";

/**
 * ❗ Importante:
 * - NO usamos statusLabel ni priorityLabel con textos
 * - Solo usamos styles desde ticketslabel
 * - Los textos salen SIEMPRE de i18n
 */

interface HeaderSectionProps {
  ticket: Ticket;
}

export const HeaderSection = ({ ticket }: HeaderSectionProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("tickets");

  return (
    <div className="flex flex-col">
      <div className="flex justify-between space-y-4">
        <ButtonBack />
        <div className="w-1 h-1" />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-varien-italic font-semibold text-oxford-blue-800">
              {ticket.title}
            </h1>
            <p className="text-xs text-slate-500">
              {t("details.ticket")}{" "}
              <span className="font-mono font-medium">#{ticket.id}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {/* STATUS */}
          <span
            className={`
            inline-flex items-center gap-1 rounded-full border px-3 py-1
            text-[11px] font-medium
            ${statusStyles[ticket.status]}
          `}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {t(`status.${ticket.status}`)}
          </span>

          {/* PRIORITY */}
          <span
            className={`
            inline-flex items-center gap-1 rounded-full border px-3 py-1
            text-[11px] font-medium
            ${priorityStyles[ticket.urgency]}
          `}
          >
            <ExclamationTriangleIcon className="h-3.5 w-3.5" />
            {t("details.priority")}: {t(`urgency.${ticket.urgency}.label`)}
          </span>

          {/* EDIT BUTTON */}
          {ticket.status === "PENDING" && (
            <button
              onClick={() => navigate(`/app/tickets/${ticket.id}/edit`)}
              className="
              inline-flex items-center gap-1
              text-white font-semibold
              bg-oxford-blue-600 hover:bg-oxford-blue-700
              rounded-lg border px-3 py-1
            "
            >
              {t("details.edit")} <PencilIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
