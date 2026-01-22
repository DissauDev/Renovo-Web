import type { Category } from "../store/features/api/categoriesApi.ts";
import type { Product } from "../store/features/api/productsApi.ts";

export type TicketStatus =
  | "PENDING"
  | "SCHEDULED"
  | "EN_ROUTE"
  | "ON_SITE"
  | "COMPLETED"
  | "CANCELLED";

export type TicketUrgency = "LOW" | "MEDIUM" | "HIGH";

export interface Ticket {
  closeReadyAt: string | number | Date;
  images: never[];
  uploads: never[];
  notesInternal: string;
  workSummary: string;
  laborMinutes: null;
  scopeItems: never[];
  id: number;
  title: string;              // en Prisma tiene default, pero en la respuesta siempre llega un string
  description: string;
  photos: string[];

  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  address?: string | null;

  scheduledAt?: string | null; // Date en backend → string en JSON

  categoryId: number;
  category: Category;          // asumiendo que ya tienes interfaz Category

  providerId: number;
  provider: User;              // quien crea el ticket (User con rol PROVIDER)

  assignedTo?: number | null;
  employee?: User | null;      // empleado asignado

  status: TicketStatus;        // 🔹 alineado con Prisma
  urgency: TicketUrgency;

  createdAt: string;           // Date → string en JSON
  onSiteAt?: string | null;
  completedAt?: string | null;

  ticketItems: TicketItem[];   // si los usas en el frontend
}

export interface TicketItem {
  id: number;
  ticketId: number;
  productId: number;
  product: Product;              // si lo incluyes con include
  nameSnapshot: string;
  priceCentsSnapshot: number;
  quantity: number;
  unitPrice: number;
}


export interface User {
  id: string;
  name: string;
  role: "ADMIN" | "EMPLOYEE" |"PROVIDER";
}

// Payload para crear ticket (lo que espera tu backend)
export interface CreateTicketRequest {
  description: string;
  photos?: string[]; // URLs de imágenes
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string;
  categoryId: number;
  providerId: number;
  // urgency?: TicketUrgency; // si luego lo agregas al backend
}
export interface ListTicketsArgs {
  categoryId?: number;
  urgency?: TicketUrgency;
  status?: TicketStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface TicketsCountersApi {
  all: number;
  pending: number;
  completed: number;
  scheduled: number;
}

export interface TicketsListResponse {
  items: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  counters: TicketsCountersApi;
}

export type ScheduleTicketRequest = {
  id: number;
  assignedTo?: number | null;  // null/undefined = no asignar
  scheduledAt: string;         // ISO string
};

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

export interface UpdateTicketRequest {
  id: number;
  data: UpdateTicketRequestData;
}

export interface AssignTicketRequest {
  id: number;
  assignedTo: number; // según tu backend, assignedTo es requerido
}

export interface ChangeStatusRequest {
  id: number;
  status: TicketStatus;
}