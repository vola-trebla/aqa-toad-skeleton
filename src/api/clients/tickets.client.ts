import { APIRequestContext } from '@playwright/test';
import { config } from '../../config/env.config';
import { ticketSchema, ticketListSchema, Ticket } from '../schemas/ticket.schema';

export class TicketsApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async create(data: {
    title: string;
    description: string;
    priority: string;
    category: string;
  }): Promise<Ticket> {
    const response = await this.request.post(`${config.API_URL}/api/tickets`, {
      data,
    });

    const body = await response.json();
    return ticketSchema.parse(body);
  }

  async getById(id: string): Promise<Ticket> {
    const response = await this.request.get(`${config.API_URL}/api/tickets/${id}`);
    const body = await response.json();
    return ticketSchema.parse(body);
  }

  async list(params?: { status?: string; priority?: string }) {
    const response = await this.request.get(`${config.API_URL}/api/tickets`, {
      params,
    });
    const body = await response.json();
    return ticketListSchema.parse(body);
  }

  async delete(id: string): Promise<void> {
    const response = await this.request.delete(`${config.API_URL}/api/tickets/${id}`);
    if (!response.ok() && response.status() !== 404) {
      throw new Error(`Failed to delete ticket ${id}: ${response.statusText()}`);
    }
  }

  async changeStatus(id: string, status: string): Promise<Ticket> {
    const response = await this.request.patch(`${config.API_URL}/api/tickets/${id}/status`, {
      data: { status },
    });
    const body = await response.json();
    return ticketSchema.parse(body);
  }
}
