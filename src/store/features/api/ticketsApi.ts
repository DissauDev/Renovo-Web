// src/store/features/api/ticketsApi.ts
import { apiSlice } from "./apiSlice";
import type {
  Ticket,
  CreateTicketRequest,
  ListTicketsArgs,
  TicketsListResponse,
  UpdateTicketRequest,
  AssignTicketRequest,
  ChangeStatusRequest,
  ScheduleTicketRequest,

} from "../../../types/tickets";


export type ScopeItemKind = "BASE" | "ADD_ON";

export type CreateScopeItemRequest = {
  id: number; // ticketId
  title: string;
  description?: string;
  photos?: string[];
  kind?: ScopeItemKind; // default "ADD_ON"
};

export type CloseTicketLineKind = "INVENTORY" | "NON_INVENTORY" | "LABOR";

type CloseTicketRequest = {
  id: number;
  completedAt?: string; // opcional
  workSummary?: string;
  notesInternal?: string;
  lineItems?: Array<{
    kind: "INVENTORY" | "NON_INVENTORY" | "LABOR";
    productId?: number;
    scopeItemId?: number;
    nameSnapshot?: string;
    unitSellCentsSnapshot?: number;
    unitCostCentsSnapshot?: number;
    quantity: number;
    notes?: string;
  }>;
};

export type CloseTicketLineItem = {
  kind: CloseTicketLineKind;
  quantity?: number;

  // INVENTORY
  productId?: number;

  // optional links
  scopeItemId?: number;

  // NON_INVENTORY / LABOR
  nameSnapshot?: string;
  unitSellCentsSnapshot?: number;
  unitCostCentsSnapshot?: number;

  notes?: string;
};
export type UpdateScopeItemRequest = {
  ticketId: number;
  scopeItemId: number;
  title: string;
  description?: string;
};

export type DeleteScopeItemRequest = {
  ticketId: number;
  scopeItemId: number;
};


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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createScopeItem: builder.mutation<any, CreateScopeItemRequest>({
  query: ({ id, title, description, photos, kind }) => ({
    url: `/tickets/${id}/scope-items`,
    method: "POST",
    data: {
      title,
      ...(description ? { description } : {}),
      ...(photos?.length ? { photos } : {}),
      ...(kind ? { kind } : {}),
    },
  }),
  invalidatesTags: (_result, _error, { id }) => [
    { type: "Ticket" as const, id },
    { type: "Ticket" as const, id: "LIST" },
  ],
}),

   closeTicket: builder.mutation<Ticket, CloseTicketRequest>({
  query: ({ id, ...body }) => ({
    url: `/tickets/${id}/close`,
    method: "PATCH",
    data: body,
  }),
  invalidatesTags: (_r, _e, { id }) => [
    { type: "Ticket", id },
    { type: "Ticket", id: "LIST" },
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

    scheduleTicket: builder.mutation<Ticket, ScheduleTicketRequest>({
  query: ({ id, assignedTo, scheduledAt }) => ({
    url: `/tickets/${id}/schedule`,
    method: "PATCH",
    data: {
      scheduledAt,
      // manda assignedTo solo si existe (backend lo soporta opcional)
      ...(assignedTo ? { assignedTo } : {}),
    },
  }),
  invalidatesTags: (_result, _error, { id }) => [
    { type: "Ticket" as const, id },
    { type: "Ticket" as const, id: "LIST" },
  ],
}),



updateScopeItem: builder.mutation<Ticket, UpdateScopeItemRequest>({
  query: ({ ticketId, scopeItemId, title, description }) => ({
    url: `/tickets/${ticketId}/scope-items/${scopeItemId}`,
    method: "PATCH",
    data: {
      title,
      ...(description ? { description } : {}),
    },
  }),
  invalidatesTags: (_result, _error, { ticketId }) => [
    { type: "Ticket" as const, id: ticketId },
    { type: "Ticket" as const, id: "LIST" },
  ],
}),

deleteScopeItem: builder.mutation<void, DeleteScopeItemRequest>({
  query: ({ ticketId, scopeItemId }) => ({
    url: `/tickets/${ticketId}/scope-items/${scopeItemId}`,
    method: "DELETE",
  }),
  invalidatesTags: (_result, _error, { ticketId }) => [
    { type: "Ticket" as const, id: ticketId },
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
  useScheduleTicketMutation,
  useCloseTicketMutation,
  useCreateScopeItemMutation,
  useDeleteScopeItemMutation,
  useUpdateScopeItemMutation
} = ticketsApi;
