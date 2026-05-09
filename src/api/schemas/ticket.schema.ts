import { z } from 'zod';

export const ticketSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['New', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  category: z.string(),
  assignee: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ticketListSchema = z.object({
  items: z.array(ticketSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type Ticket = z.infer<typeof ticketSchema>;
export type TicketList = z.infer<typeof ticketListSchema>;
