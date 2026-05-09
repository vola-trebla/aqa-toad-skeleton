import { Page } from '@playwright/test';
import { BasePage } from '../../core/base.page';
import { ModalComponent } from '../../components/modal.component';

type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export class TicketDetailPage extends BasePage {
  readonly url = '/tickets';
  private readonly modal: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.modal = new ModalComponent(page);
  }

  private readonly selectors = {
    status: '[data-testid="ticket-status"]',
    priority: '[data-testid="ticket-priority"]',
    assignee: '[data-testid="ticket-assignee"]',
    description: '[data-testid="ticket-description"]',
    changeStatusBtn: '[data-testid="change-status-btn"]',
    statusOption: (status: TicketStatus) =>
      `[data-testid="status-option-${status.toLowerCase().replace(' ', '-')}"]`,
    commentInput: '[data-testid="comment-input"]',
    addCommentBtn: '[data-testid="add-comment-btn"]',
    commentsList: '[data-testid="comments-list"]',
  };

  async getStatus(): Promise<string> {
    return this.page.locator(this.selectors.status).innerText();
  }

  async changeStatus(newStatus: TicketStatus): Promise<void> {
    await this.page.locator(this.selectors.changeStatusBtn).click();

    await this.clickAndWait(this.page.locator(this.selectors.statusOption(newStatus)), {
      waitForResponse: '/api/tickets/',
    });

    if (await this.modal.isVisible()) {
      await this.modal.confirm();
    }
  }

  async addComment(text: string): Promise<void> {
    await this.page.locator(this.selectors.commentInput).fill(text);
    await this.clickAndWait(this.page.locator(this.selectors.addCommentBtn), {
      waitForResponse: '/api/comments',
    });
  }

  async getCommentsCount(): Promise<number> {
    return this.page
      .locator(this.selectors.commentsList)
      .locator('[data-testid="comment-item"]')
      .count();
  }
}
