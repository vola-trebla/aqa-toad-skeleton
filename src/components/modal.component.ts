import { Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';
import { UIElement } from '../core/ui-element';

export class ModalComponent extends BaseComponent {
  readonly title: UIElement;
  readonly closeBtn: UIElement;
  readonly confirmBtn: UIElement;

  constructor(page: Page, selector: string = '[data-testid="modal"]') {
    super(page, selector);

    this.title = this.element('[data-testid="modal-title"]', 'Modal Title');
    this.closeBtn = this.element('[data-testid="modal-close"]', 'Modal Close Button');
    this.confirmBtn = this.element('[data-testid="modal-confirm"]', 'Modal Confirm Button');
  }

  async close(): Promise<void> {
    await this.closeBtn.click();
    await this.waitForHidden();
  }

  async confirm(): Promise<void> {
    await this.confirmBtn.click();
  }

  async getTitle(): Promise<string> {
    return await this.title.locator.innerText();
  }
}
