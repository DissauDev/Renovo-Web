import * as React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { Ticket, User } from "../../types/tickets";
import { StatusSelect } from "../atoms/inputs/StatusSelect";
import { useAssignTicketMutation } from "../../store/features/api/ticketsApi";
import { toastNotify } from "../../lib/toastNotify";

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
  const currentTech = ticket.employee;
  const [assignTicket, { isLoading: isAssignin }] = useAssignTicketMutation();

  const ticketId = Number(ticket.id);
  const handleTechnicianChange = async (techId: string) => {
    const numericId = Number(techId);

    try {
      await assignTicket({
        id: ticketId,
        assignedTo: numericId,
      }).unwrap();

      toastNotify("Technician updated", "success");
      onStatusUpdated?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toastNotify(error?.message || "Error updating technician", "error");
    }
  };

  // 🔹 estado local para el técnico seleccionado en el select
  const [selectedTechId, setSelectedTechId] = React.useState<string>(
    currentTech ? String(currentTech.id) : "UNASSIGNED"
  );

  // si cambia el ticket (refetch, etc), sincronizamos el valor
  React.useEffect(() => {
    setSelectedTechId(currentTech ? String(currentTech.id) : "UNASSIGNED");
  }, [currentTech]);

  const handleConfirm = () => {
    // "" = unassign (mantiene tu contrato actual)
    const valueToSend = selectedTechId === "UNASSIGNED" ? "" : selectedTechId;
    handleTechnicianChange(valueToSend);
  };

  const disableConfirm =
    isAssignin ||
    selectedTechId === (currentTech ? String(currentTech.id) : "UNASSIGNED");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        Assigned technician
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
            {currentTech?.name ?? "Unassigned"}
          </div>
          <div className="text-slate-500">
            {currentTech
              ? "Field technician"
              : "Assign this ticket to an available technician."}
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-2">
        <StatusSelect
          value={selectedTechId}
          onChange={(value) => setSelectedTechId(value)}
          placeholder={
            isLoading ? "Loading technicians..." : "Select technician"
          }
          options={[
            { value: "UNASSIGNED", label: "Unassigned" },
            ...technicians.map((tech) => ({
              value: String(tech.id),
              label: tech.name,
            })),
          ]}
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={disableConfirm}
          className={`inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-xs font-medium shadow-sm border
            ${
              disableConfirm
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
            }`}
        >
          Confirm assignment
        </button>
      </div>
    </section>
  );
};
