import { test as authTest } from './auth.fixture';
import { TicketsApiClient } from '../api/clients/tickets.client';
import { TicketBuilder } from '../helpers/data-factory';

export const test = authTest.extend<{
  testTicket: { id: string; title: string };
  ticketsApi: TicketsApiClient;
}>({
  ticketsApi: async ({ request }, use) => {
    await use(new TicketsApiClient(request));
  },

  testTicket: async ({ ticketsApi }, use) => {
    const data = new TicketBuilder()
      .withTitle(`E2E-test-${Date.now()}`)
      .withPriority('High')
      .build();

    const ticket = await ticketsApi.create(data);

    await use({ id: ticket.id, title: data.title });

    await ticketsApi.delete(ticket.id);
  },
});
