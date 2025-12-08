// src/store/features/api/ticketsApi.ts
import { apiSlice } from "./apiSlice";
import type {
  Ticket,
  CreateTicketRequest,
  ListTicketsArgs,
  TicketsListResponse,
  TicketStatus,
} from "../../../types/tickets";

// --------- Payload types ---------

interface UpdateTicketRequestData {
  title?: string;
  description?: string;
  photos?: string[];
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  address?: string | null;
  categoryId?: number;
  assignedTo?: number | null;
  urgency?: Ticket["urgency"];
  scheduledAt?: string | null;
  onSiteAt?: string | null;
  completedAt?: string | null;
}

interface UpdateTicketRequest {
  id: number;
  data: UpdateTicketRequestData;
}

interface AssignTicketRequest {
  id: number;
  assignedTo: number; // según tu backend, assignedTo es requerido
}

interface ChangeStatusRequest {
  id: number;
  status: TicketStatus;
}

// ---------------------------------

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /tickets
    getTickets: builder.query<TicketsListResponse, ListTicketsArgs | void>({
      query: (params) => ({
        url: "/tickets",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((t) => ({
                type: "Ticket" as const,
                id: t.id,
              })),
              { type: "Ticket" as const, id: "LIST" },
            ]
          : [{ type: "Ticket" as const, id: "LIST" }],
    }),

    // POST /tickets
    createTicket: builder.mutation<Ticket, CreateTicketRequest>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Ticket", id: "LIST" }],
    }),

    // GET /tickets/:id
    getTicketById: builder.query<Ticket, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "Ticket" as const, id },
      ],
    }),

    // PATCH /tickets/:id
    updateTicket: builder.mutation<Ticket, UpdateTicketRequest>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ticket" as const, id },
        { type: "Ticket" as const, id: "LIST" },
      ],
    }),

    // PATCH /tickets/:id/assign
    assignTicket: builder.mutation<Ticket, AssignTicketRequest>({
      query: ({ id, assignedTo }) => ({
        url: `/tickets/${id}/assign`,
        method: "PATCH",
        data: { assignedTo },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ticket" as const, id },
        { type: "Ticket" as const, id: "LIST" },
      ],
    }),

    // PATCH /tickets/:id/status
    changeTicketStatus: builder.mutation<Ticket, ChangeStatusRequest>({
      query: ({ id, status }) => ({
        url: `/tickets/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ticket" as const, id },
        { type: "Ticket" as const, id: "LIST" },
      ],
    }),

    // DELETE /tickets/:id
    deleteTicket: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Ticket" as const, id },
        { type: "Ticket" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useAssignTicketMutation,
  useChangeTicketStatusMutation,
  useDeleteTicketMutation,
} = ticketsApi;
