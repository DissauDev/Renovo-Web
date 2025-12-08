import type { Ticket, TicketStatus } from "../../types/tickets";

export const statusLabel: Record<TicketStatus, string> = {
  PENDING: "Pending",
  SCHEDULED: "Scheduled",
  EN_ROUTE: "On Route",
  ON_SITE: "On Site",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const statusOptions: TicketStatus[] = [
  "PENDING",
  "SCHEDULED",
  "EN_ROUTE",
  "ON_SITE",
  "COMPLETED",
  "CANCELLED",
];

 export const statusDotColor: Record<TicketStatus, string> = {
  PENDING: "bg-amber-500",
  SCHEDULED: "bg-sky-500",
  EN_ROUTE: "bg-blue-500",
  ON_SITE: "bg-indigo-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

export const priorityLabel: Record<Ticket["urgency"], string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const priorityStyles: Record<Ticket["urgency"], string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

 export const statusStyles: Record<TicketStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  SCHEDULED: "bg-sky-50 text-sky-700 border-sky-200",
  EN_ROUTE: "bg-blue-50 text-blue-700 border-blue-200",
  ON_SITE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};
