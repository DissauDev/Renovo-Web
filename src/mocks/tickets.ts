/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/mocks/tickets.ts
import type { Ticket } from "../types/tickets";

export const mockTickets: Ticket[] = [
  {
    //@ts-ignore
    id: "T-1001",
    title: "Fuga de agua en baño principal",
    description: "Goteo constante debajo del lavamanos. Posible tubería rota.",
    address: "123 Main St, Miami, FL",
    //@ts-ignore
    category: "PLUMBING",
    priority: "HIGH",
    status: "PENDING",
    customerName: "John Doe",
    technician: {
      id: "tech-1",
      name: "Carlos Pérez",
      role: "EMPLOYEE",
    },
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
    photos: ["http://st2.depositphotos.com/1970689/5892/i/450/depositphotos_58921065-stock-photo-leak-and-ruin-valve.jpg"],
  },


 
];
