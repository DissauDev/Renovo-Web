/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetTicketByIdQuery } from "../../store/features/api/ticketsApi";
import { useGetUsersQuery, type User } from "../../store/features/api/userApi";

import { HeaderSection } from "../../components/tickets/HeaderSection";
import { PhotosSection } from "./PhotosSection";
import { TechnicianPanel } from "../../components/tickets/TechnicianPanel";
import { StatusPanel } from "../../components/tickets/StatusPanel";
import { DescriptionSection } from "./DescriptionSection";
import { DetailsSection } from "./DetailsSection";
import { ClientCard } from "../../components/tickets/ClientCard";
import { ScopeItemQuickAdd } from "../../components/tickets/ScopeItemQuickAdd";
import { CloseTicketPanel } from "../../components/tickets/CloseTicketPanel";
import { useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store/store";
import { ButtonBack } from "../../components/layout/ButtonBack";

export const TicketsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation("tickets");

  const user = useAppSelector((state: RootState) => state.auth.user);

  const ticketId = Number(id);

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useGetTicketByIdQuery(ticketId!, {
    skip: !ticketId,
  });

  const { data: techniciansData, isLoading: isLoadingTechnicians } =
    useGetUsersQuery({
      role: "EMPLOYEE",
      page: 1,
      pageSize: 50,
      //@ts-ignore
      active: "true",
    });

  const technicians: User[] = techniciansData?.items ?? [];

  // ── Estados de error / loading ──
  if (!ticketId) {
    return (
      <div className="space-y-4">
        <ButtonBack />
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          {t("edit.invalidId")}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">
        {t("details.loadingTicketDetails")}
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-4">
        <ButtonBack />

        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          {t("details.ticketNotFound", { id })}
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          {t("edit.retry")}
        </button>
      </div>
    );
  }

  // helpers
  const createdAt = new Date(ticket.createdAt).toLocaleString();
  const scheduledAt = ticket?.scheduledAt
    ? new Date(ticket.scheduledAt).toLocaleString()
    : "";

  return (
    <div className="space-y-6">
      {/* Header + acciones */}
      <HeaderSection ticket={ticket} />

      {/* Layout principal */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <DescriptionSection description={ticket.description} />

          <DetailsSection
            address={ticket.address}
            createdAt={createdAt}
            scheduletAt={scheduledAt}
          />

          <PhotosSection
            photos={(ticket.images ?? [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((ti: any) => ti.kind === "TICKET")
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((ti: any) => ti.image.url)}
          />

          {(user?.role === "ADMIN" || user?.role === "EMPLOYEE") && (
            <>
              <ScopeItemQuickAdd
                ticketId={ticketId}
                scopeItems={ticket.scopeItems ?? []}
                onChanged={() => refetch()}
                disabled={ticket.status === "CANCELLED"}
              />

              <div className="lg:block hidden">
                <CloseTicketPanel
                  ticketId={ticketId}
                  defaultImages={ticket.images}
                  defaultWorkSummary={ticket?.workSummary ?? ""}
                  defaultInternalNotes={ticket?.notesInternal ?? ""}
                />
              </div>
            </>
          )}
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <StatusPanel
            ticket={ticket}
            onStatusUpdated={() => {
              refetch();
            }}
          />

          <ClientCard
            clientName={ticket.clientName}
            providername={ticket?.provider?.name}
          />

          <TechnicianPanel
            ticket={ticket}
            onStatusUpdated={() => {
              refetch();
            }}
            //@ts-ignore
            technicians={technicians}
            isLoadingTechnicians={isLoadingTechnicians}
          />

          {(user?.role === "ADMIN" || user?.role === "EMPLOYEE") && (
            <div className="lg:hidden block">
              <CloseTicketPanel
                ticketId={ticketId}
                defaultImages={ticket.images}
                defaultWorkSummary={ticket?.workSummary ?? ""}
                defaultInternalNotes={ticket?.notesInternal ?? ""}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
