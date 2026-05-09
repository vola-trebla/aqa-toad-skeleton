import { test, expect } from '../../src/fixtures';

test.describe('Tickets API', () => {
  test('создание тикета возвращает валидную структуру', async ({ ticketsApi }) => {
    const ticketData = {
      title: 'API test ticket',
      description: 'Created via API test',
      priority: 'Medium',
      category: 'Software',
    };

    const ticket = await ticketsApi.create(ticketData);

    expect(ticket.status).toBe('New');
    expect(ticket.priority).toBe('Medium');
    expect(ticket.assignee).toBeNull();

    await ticketsApi.delete(ticket.id);
  });

  test('смена статуса через API отражается корректно', async ({ ticketsApi, testTicket }) => {
    const updated = await ticketsApi.changeStatus(testTicket.id, 'Assigned');

    expect(updated.status).toBe('Assigned');
    expect(updated.id).toBe(testTicket.id);
  });
});
