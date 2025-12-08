import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { TicketStatus, TicketUrgency, Ticket } from "../../types/tickets";
import { TicketCard } from "../../components/tickets/TicketsCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  TicketsViewTabs,
  type ViewFilter,
  type TicketsCounters,
} from "../../components/tickets/TicketsViewTabs";
import { useGetTicketsQuery } from "../../store/features/api/ticketsApi";
import { UrgencySelect } from "../../components/atoms/inputs/UrgencySelect";
import { AsyncSelect } from "../../components/atoms/inputs/AsyncSelect";
import {
  useGetCategoriesQuery,
  type Category,
} from "../../store/features/api/categoriesApi.ts";
import { StatusSelect } from "../../components/atoms/inputs/StatusSelect.tsx";
import { HeaderTab } from "../../components/layout/HeaderTab.tsx";

const statusFilterLabel: Record<"ALL" | TicketStatus, string> = {
  ALL: "Todos",
  PENDING: "Pending",
  EN_ROUTE: "On Route",
  ON_SITE: "On Site",
  CANCELLED: "Canceled",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
};

interface TicketsPageProps {
  currentUserId: string;
}

export const TicketsMainPage: React.FC<TicketsPageProps> = ({
  currentUserId,
}) => {
  const [viewFilter, setViewFilter] = useState<ViewFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TicketStatus>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | TicketUrgency>(
    "ALL"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const navigate = useNavigate();

  const queryArgs = useMemo(() => {
    const args: {
      categoryId?: number;
      status?: TicketStatus;
      urgency?: TicketUrgency;
      search?: string;
      page?: number;
      pageSize?: number;
    } = {};

    if (statusFilter !== "ALL") {
      args.status = statusFilter;
    } else {
      switch (viewFilter) {
        case "COMPLETED":
          args.status = "COMPLETED";
          break;
        case "WAITING_FOR_ME":
          args.status = "PENDING";
          break;
        default:
          break;
      }
    }

    if (priorityFilter !== "ALL") {
      args.urgency = priorityFilter;
    }

    if (searchTerm.trim()) {
      args.search = searchTerm.trim();
    }
    if (categoryFilter !== "ALL") {
      args.categoryId = Number(categoryFilter);
    }
    args.page = 1;
    args.pageSize = 20;

    return args;
  }, [statusFilter, priorityFilter, searchTerm, categoryFilter, viewFilter]);

  const { data, isLoading, isError } = useGetTicketsQuery(queryArgs);

  const apiTickets: Ticket[] = useMemo(() => data?.items ?? [], [data]);

  const baseTickets = useMemo(() => {
    return apiTickets;
  }, [apiTickets]);

  const counters: TicketsCounters = useMemo(() => {
    const backendCounters = data?.counters;

    const all = backendCounters?.all ?? baseTickets.length;
    const waitingForMe = backendCounters?.pending ?? 0;
    const unassigned =
      backendCounters?.unassigned ??
      baseTickets.filter((t) => !t.employee).length;
    const completed =
      backendCounters?.completed ??
      baseTickets.filter((t) => t.status === "COMPLETED").length;

    const assignedToMe = baseTickets.filter(
      (t) => t.employee?.id === currentUserId
    ).length;

    return {
      all,
      assignedToMe,
      waitingForMe,
      unassigned,
      completed,
    };
  }, [data?.counters, baseTickets, currentUserId]);

  const tickets = useMemo(() => {
    let list = [...baseTickets];

    switch (viewFilter) {
      case "WAITING_FOR_ME":
        list = list.filter((t) => t.employee?.id === currentUserId);
        break;
      case "UNASSIGNED":
        list = list.filter((t) => !t.employee);
        break;
      case "COMPLETED":
      case "ALL":
      default:
        break;
    }

    return list;
  }, [baseTickets, viewFilter, currentUserId]);
  return (
    <div className="space-y-4">
      {/* Header simple */}
      <div className="flex flex-col gap-2">
        <HeaderTab hadle={() => navigate("/app/tickets/new")} title="Tickets" />
        <p className="text-sm text-oxford-blue-700 font-medium">
          Manage your work orders by status, assignment, and urgency.
        </p>
      </div>

      {/* Tabs de vista (componente separado) */}
      <TicketsViewTabs
        viewFilter={viewFilter}
        onChange={setViewFilter}
        counters={counters}
      />

      {/* Filtros inferiores: búsqueda + dropdowns */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Búsqueda */}
        <div className="w-full md:max-w-sm">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description or cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2
                rounded-lg border border-slate-300
                bg-white text-xs text-slate-700
                focus:outline-none focus:ring-1 focus:ring-oxford-blue-500 focus:border-oxford-blue-500
              "
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap  justify-end">
          <div className="justify-evenly space-x-2 flex flex-wrap">
            {/* Urgencia */}
            <UrgencySelect
              mode="filter"
              includeAllOption
              label="Urgency"
              value={priorityFilter}
              onChange={(v) => setPriorityFilter(v as "ALL" | TicketUrgency)}
            />{" "}
            {/* Estado */}
            <StatusSelect
              label="Status"
              wrapperClassName="min-w-30  gap-0.5"
              value={statusFilter} // "ALL" | TicketStatus
              onChange={(value) =>
                setStatusFilter(value as "ALL" | TicketStatus)
              }
              includeAllOption
              allLabel="All"
              allValue="ALL"
              options={Object.entries(statusFilterLabel)
                .filter(([key]) => key !== "ALL") // evitamos duplicar la opción All
                .map(([value, label]) => ({
                  value,
                  label,
                  // si quieres punticos de color por estado:
                  dotClassName:
                    value === "PENDING"
                      ? "bg-amber-400"
                      : value === "COMPLETED"
                      ? "bg-emerald-500"
                      : value === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-slate-300",
                }))}
            />
            {/* Categoría / departamento (de momento solo front) */}
            <AsyncSelect<Category>
              mode="filter"
              label="Category"
              name="departmentFilter"
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              useOptionsHook={useGetCategoriesQuery}
              getOptionLabel={(c) => c.name}
              getOptionValue={(c) => String(c.id)}
              enableSearch
              includeAllOption
              wrapperClassName="w-40 gap-0.5"
              labelClassName="text-[10px]"
            />
          </div>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && (
          <div className="col-span-full text-center text-sm text-slate-400 py-10">
            Loading tickets...
          </div>
        )}

        {isError && !isLoading && (
          <div className="col-span-full text-center text-sm text-red-500 py-10">
            Error to load tickets.
          </div>
        )}

        {!isLoading &&
          !isError &&
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => navigate(`/app/tickets/${ticket.id}`)}
            />
          ))}

        {!isLoading && !isError && tickets.length === 0 && (
          <div className="col-span-full text-center text-sm text-slate-400 py-10">
            No results
          </div>
        )}
      </div>
    </div>
  );
};
