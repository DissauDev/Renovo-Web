import * as React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { Ticket, User } from "../../types/tickets";
import { StatusSelect } from "../atoms/inputs/StatusSelect";
import { useScheduleTicketMutation } from "../../store/features/api/ticketsApi";
import { toastNotify } from "../../lib/toastNotify";
import { DateTimePicker } from "../ui/dateTimePicker";
import { useTranslation } from "react-i18next";
import { showApiError } from "../../lib/showApiError";

interface TechnicianPanelProps {
  ticket: Ticket;
  isLoading: boolean;
  technicians: User[];
  onStatusUpdated?: () => void;
}

export const TechnicianPanel: React.FC<TechnicianPanelProps> = ({
  ticket,
  technicians,
  isLoading,
  onStatusUpdated,
}) => {
  const { t } = useTranslation("tickets");
  const currentTech = ticket.employee;
  const ticketId = Number(ticket.id);

  const [scheduleTicket, { isLoading: isScheduling }] =
    useScheduleTicketMutation();

  // técnico seleccionado
  const [selectedTechId, setSelectedTechId] = React.useState<string>(
    currentTech ? String(currentTech.id) : "UNASSIGNED",
  );

  // fecha/hora seleccionada
  const [scheduledAtLocal, setScheduledAtLocal] = React.useState<Date | null>(
    ticket.scheduledAt ? new Date(ticket.scheduledAt) : null,
  );

  React.useEffect(() => {
    setSelectedTechId(currentTech ? String(currentTech.id) : "UNASSIGNED");
  }, [currentTech]);

  React.useEffect(() => {
    setScheduledAtLocal(
      ticket.scheduledAt ? new Date(ticket.scheduledAt) : null,
    );
  }, [ticket.scheduledAt]);

  const handleConfirm = async () => {
    try {
      if (selectedTechId === "UNASSIGNED") {
        toastNotify(t("technician.errors.selectTechnician"), "error");
        return;
      }

      if (!scheduledAtLocal) {
        toastNotify(t("technician.errors.selectDate"), "error");

        return;
      }

      const assignedTo = Number(selectedTechId);

      await scheduleTicket({
        id: ticketId,
        assignedTo, // null si quieres permitir unassign
        scheduledAt: scheduledAtLocal.toISOString(),
      }).unwrap();

      toastNotify(t("technician.success"), "success");

      onStatusUpdated?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showApiError(error, t, "technician.errors.schedule");
    }
  };

  const disableConfirm =
    isScheduling ||
    selectedTechId === "UNASSIGNED" ||
    !scheduledAtLocal ||
    (selectedTechId === (currentTech ? String(currentTech.id) : "UNASSIGNED") &&
      // compara scheduledAt actual vs local (por ms)
      ((ticket.scheduledAt &&
        scheduledAtLocal &&
        new Date(ticket.scheduledAt).getTime() ===
          scheduledAtLocal.getTime()) ||
        (!ticket.scheduledAt && !scheduledAtLocal)));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        {t("technician.title")}
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
          {currentTech ? (
            currentTech.name
              .split(" ")
              .filter(Boolean)
              .map((p) => p[0])
              .join("")
              .toUpperCase()
          ) : (
            <UserCircleIcon className="h-5 w-5" />
          )}
        </div>

        <div className="text-sm text-slate-600 flex-1">
          <div className="font-semibold text-slate-800">
            {currentTech?.name ?? t("technician.unassigned")}
          </div>
          <div className="text-slate-500">{t("technician.subtitle")}</div>
        </div>
      </div>

      <div className="space-y-3">
        <StatusSelect
          value={selectedTechId}
          onChange={setSelectedTechId}
          placeholder={
            isLoading ? t("technician.loading") : t("technician.select")
          }
          options={[
            { value: "UNASSIGNED", label: t("technician.unassigned") },

            ...technicians.map((tech) => ({
              value: String(tech.id),
              label: tech.name,
            })),
          ]}
        />

        <DateTimePicker
          value={scheduledAtLocal}
          onChange={(d: React.SetStateAction<Date | null>) =>
            setScheduledAtLocal(d)
          }
          defaultTime="10:30:00"
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={disableConfirm}
          className={`inline-flex w-full items-center 
            justify-center rounded-lg px-3 py-2 text-sm font-varien shadow-sm border
            ${
              disableConfirm
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-oxford-blue-700 text-white  hover:bg-oxford-blue-800"
            }`}
        >
          {t("technician.confirm")}
        </button>
      </div>
    </section>
  );
};
