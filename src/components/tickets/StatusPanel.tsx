// src/components/tickets/StatusPanel.tsx
import { useEffect, useState } from "react";
import { statusDotColor } from "../../pages/tickets/ticketslabel";
import type { Ticket, TicketStatus } from "../../types/tickets";
import { StatusSelect } from "../atoms/inputs/StatusSelect";
import { useChangeTicketStatusMutation } from "../../store/features/api/ticketsApi";
import { toastNotify } from "../../lib/toastNotify";
import { useTranslation } from "react-i18next";

interface StatusPanelProps {
  ticket: Ticket;
  /** Optional: parent can refetch ticket list/details after a successful update */
  onStatusUpdated?: () => void;
}

const STATUS_PANEL_OPTIONS: TicketStatus[] = [
  "PENDING",
  "EN_ROUTE",
  "ON_SITE",
  "CANCELLED",
];

export const StatusPanel = ({ ticket, onStatusUpdated }: StatusPanelProps) => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket.status
  );

  const { t } = useTranslation("tickets");

  const selectOptions = (() => {
    const base = STATUS_PANEL_OPTIONS;

    // Si el ticket viene en SCHEDULED o COMPLETED, lo incluimos
    // solo para que se vea (no significa que lo “promovemos” como opción de uso general)
    const all = base.includes(ticket.status)
      ? base
      : ([ticket.status, ...base] as TicketStatus[]);

    // Evita duplicados por si acaso
    const unique = Array.from(new Set(all));

    return unique.map((status) => ({
      value: status,
      label: t(`status.${status}`),
      dotClassName: statusDotColor[status],
    }));
  })();

  const [changeTicketStatus, { isLoading: isUpdating }] =
    useChangeTicketStatusMutation();

  // Keep local selectedStatus in sync if ticket changes from outside
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedStatus(ticket.status);
  }, [ticket.status, ticket.id]);

  const handleConfirmStatus = async () => {
    // Nothing to do if status didn't change
    if (selectedStatus === ticket.status) return;

    try {
      await changeTicketStatus({
        id: ticket.id,
        status: selectedStatus,
      }).unwrap();

      toastNotify(t("statusPanel.success"), "success");

      onStatusUpdated?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error?.message || t("statusPanel.error"), "error");
    }
  };

  const hasChanges = selectedStatus !== ticket.status;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("statusPanel.title")}
      </h2>

      <div className="space-y-2 text-xs text-slate-600">
        <p>{t("statusPanel.description")}</p>

        <StatusSelect
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value as TicketStatus)}
          placeholder={t("statusPanel.select")}
          options={selectOptions}
        />

        <div className="flex flex-col gap-2 pt-2">
          {/* Main confirm button */}
          <button
            type="button"
            onClick={handleConfirmStatus}
            disabled={isUpdating || !hasChanges}
            className="inline-flex w-full items-center justify-center rounded-lg bg-oxford-blue-600
             px-3 py-2 text-sm font-varien text-white shadow-sm hover:bg-oxford-blue-700 disabled:opacity-60"
          >
            {isUpdating
              ? t("statusPanel.updating")
              : hasChanges
              ? t("statusPanel.confirm")
              : t("statusPanel.noChanges")}
          </button>
        </div>
      </div>
    </section>
  );
};
