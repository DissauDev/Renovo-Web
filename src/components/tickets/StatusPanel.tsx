// src/components/tickets/StatusPanel.tsx
import { useEffect, useState } from "react";
import {
  statusDotColor,
  statusLabel,
  statusOptions,
} from "../../pages/tickets/ticketslabel";
import type { Ticket, TicketStatus } from "../../types/tickets";
import { StatusSelect } from "../atoms/inputs/StatusSelect";
import { useChangeTicketStatusMutation } from "../../store/features/api/ticketsApi";
import { toastNotify } from "../../lib/toastNotify";

interface StatusPanelProps {
  ticket: Ticket;
  /** Optional: parent can refetch ticket list/details after a successful update */
  onStatusUpdated?: () => void;
}

export const StatusPanel = ({ ticket, onStatusUpdated }: StatusPanelProps) => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(
    ticket.status
  );

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

      toastNotify("Ticket status updated", "success");
      onStatusUpdated?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toastNotify(error?.message || "Error updating ticket status", "error");
    }
  };

  const handleMarkCompletedLocal = () => {
    setSelectedStatus("COMPLETED");
  };

  const hasChanges = selectedStatus !== ticket.status;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-varien text-oxford-blue-800">
        Ticket status
      </h2>

      <div className="space-y-2 text-xs text-slate-600">
        <p>
          Change the ticket status according to the technician&apos;s progress
          or the dispatch team.
        </p>

        <StatusSelect
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value as TicketStatus)}
          placeholder="Select status"
          options={statusOptions.map((status) => ({
            value: status,
            label: statusLabel[status],
            dotClassName: statusDotColor[status],
          }))}
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
              ? "Updating status..."
              : hasChanges
              ? "Confirm status change"
              : "No changes to save"}
          </button>

          {/* Helper: quickly set to completed, but still requires confirm */}
          {selectedStatus !== "COMPLETED" && (
            <button
              type="button"
              onClick={handleMarkCompletedLocal}
              className="inline-flex w-full items-center justify-center  
              rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm
               font-varien  text-slate-700 hover:bg-slate-100"
            >
              Set status to Completed
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
