import { test } from '../../src/fixtures';
import { TicketDetailPage } from '../../src/pages/tickets/ticket-detail.page';

test.describe('Ticket Lifecycle — state machine', () => {
  test('полный жизненный цикл тикета: New → Assigned → In Progress → Resolved → Closed', async ({
    authenticatedPage,
    testTicket,
  }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    // New → Assigned
    await ticketPage.changeStatus('Assigned');
    await ticketPage.status.shouldHaveText('Assigned');

    // Assigned → In Progress
    await ticketPage.changeStatus('In Progress');
    await ticketPage.status.shouldHaveText('In Progress');

    // In Progress → Resolved
    await ticketPage.changeStatus('Resolved');
    await ticketPage.status.shouldHaveText('Resolved');

    // Resolved → Closed
    await ticketPage.changeStatus('Closed');
    await ticketPage.status.shouldHaveText('Closed');
  });

  test('нельзя закрыть тикет без резолюции', async ({ authenticatedPage, testTicket }) => {
    const ticketPage = new TicketDetailPage(authenticatedPage);

    await authenticatedPage.goto(`/tickets/${testTicket.id}`);

    // Пытаемся перескочить статусы
    await ticketPage.changeStatus('Closed');

    // Ожидаем что статус НЕ изменился
    await ticketPage.status.shouldHaveText('New');
  });
});
