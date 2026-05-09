import { test, expect } from '../../src/fixtures';
import { TicketDetailPage } from '../../src/pages/tickets/ticket-detail.page';

test.describe('Ticket Lifecycle — state machine', () => {
  test('полный жизненный цикл тикета: New → Assigned → In Progress → Resolved → Closed', async ({
    authenticatedPage,
    testTicket,
  }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    await ticketPage.changeStatus('Assigned');
    expect(await ticketPage.getStatus()).toBe('Assigned');

    await ticketPage.changeStatus('In Progress');
    expect(await ticketPage.getStatus()).toBe('In Progress');

    await ticketPage.changeStatus('Resolved');
    expect(await ticketPage.getStatus()).toBe('Resolved');

    await ticketPage.changeStatus('Closed');
    expect(await ticketPage.getStatus()).toBe('Closed');
  });

  test('нельзя закрыть тикет без резолюции', async ({ authenticatedPage, testTicket }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    // Пытаемся перескочить статусы (предположим, что UI не дает, но мы проверяем логику)
    await ticketPage.changeStatus('Closed');

    // Ожидаем что статус НЕ изменился (в реальном приложении тут была бы ошибка или статус остался New)
    expect(await ticketPage.getStatus()).toBe('New');
  });
});
