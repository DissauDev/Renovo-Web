/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { useGetTicketByIdQuery } from "../../store/features/api/ticketsApi";
import { useGetUsersQuery, type User } from "../../store/features/api/userApi";

import { HeaderSection } from "../../components/tickets/HeaderSection";
import { PhotosSection } from "./PhotosSection";
import { TechnicianPanel } from "../../components/tickets/TechnicianPanel";
import { StatusPanel } from "../../components/tickets/StatusPanel";
import { DescriptionSection } from "./DescriptionSection";
import { DetailsSection } from "./DetailsSection";
import { ClientCard } from "../../components/tickets/ClientCard";

export const TicketsDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // ── Estados de error / loading básicos ──
  if (!ticketId) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </button>

        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          El ID del ticket es inválido.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Cargando detalles del ticket...
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </button>

        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
          El ticket con ID <span className="font-semibold">{id}</span> no existe
          o fue eliminado.
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs px-3 py-1 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // helpers

  const createdAt = new Date(ticket.createdAt).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header + acciones */}
      <HeaderSection ticket={ticket} onBack={() => navigate(-1)} />

      {/* Layout principal: izquierda detalles, derecha panel info */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <DescriptionSection description={ticket.description} />

          <DetailsSection address={ticket.address} createdAt={createdAt} />

          <PhotosSection photos={ticket.photos} />
        </div>

        {/* Columna derecha: panel de gestión */}
        <div className="space-y-4">
          <StatusPanel
            ticket={ticket}
            onStatusUpdated={() => {
              refetch(); // si quieres refrescar el ticket después de actualizar
            }}
          />
          <ClientCard
            clientName={ticket.clientName}
            providername={ticket?.provider?.name}
          />

          <TechnicianPanel
            ticket={ticket}
            onStatusUpdated={() => {
              refetch(); // si quieres refrescar el ticket después de actualizar
            }}
            //@ts-ignore
            technicians={technicians}
            isLoadingTechnicians={isLoadingTechnicians}
          />
        </div>
      </div>
    </div>
  );
};
