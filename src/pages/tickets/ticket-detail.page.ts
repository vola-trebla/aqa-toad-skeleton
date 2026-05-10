import { Page } from '@playwright/test';
import { BasePage } from '../../core/base.page';
import { ModalComponent } from '../../components/modal.component';
import { UIElement } from '../../core/ui-element';

type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export class TicketDetailPage extends BasePage {
  readonly url = '/tickets';
  readonly modal: ModalComponent;

  // Элементы страницы
  readonly status: UIElement;
  readonly priority: UIElement;
  readonly assignee: UIElement;
  readonly description: UIElement;
  readonly changeStatusBtn: UIElement;
  readonly commentInput: UIElement;
  readonly addCommentBtn: UIElement;
  readonly commentsList: UIElement;

  constructor(page: Page) {
    super(page);
    this.modal = new ModalComponent(page);

    this.status = this.element('[data-testid="ticket-status"]', 'Ticket Status');
    this.priority = this.element('[data-testid="ticket-priority"]', 'Ticket Priority');
    this.assignee = this.element('[data-testid="ticket-assignee"]', 'Ticket Assignee');
    this.description = this.element('[data-testid="ticket-description"]', 'Ticket Description');
    this.changeStatusBtn = this.element(
      '[data-testid="change-status-btn"]',
      'Change Status Button'
    );
    this.commentInput = this.element('[data-testid="comment-input"]', 'Comment Input');
    this.addCommentBtn = this.element('[data-testid="add-comment-btn"]', 'Add Comment Button');
    this.commentsList = this.element('[data-testid="comments-list"]', 'Comments List');
  }

  // Хелпер для получения элемента опции статуса
  private getStatusOption(status: TicketStatus): UIElement {
    const selector = `[data-testid="status-option-${status.toLowerCase().replace(' ', '-')}"]`;
    return this.element(selector, `Status Option: ${status}`);
  }

  async changeStatus(newStatus: TicketStatus): Promise<void> {
    await this.changeStatusBtn.click();

    // Ждем обновления через API при выборе опции
    const statusOption = this.getStatusOption(newStatus);
    await statusOption.click();

    // Если статус требует подтверждения — обрабатываем модалку
    if (await this.modal.isVisible()) {
      await this.modal.confirm();
    }
  }

  async addComment(text: string): Promise<void> {
    await this.commentInput.fill(text);
    await this.addCommentBtn.click();
  }
}
