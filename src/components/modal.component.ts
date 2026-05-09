import { Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';

export class ModalComponent extends BaseComponent {
  constructor(page: Page, selector: string = '[data-testid="modal"]') {
    super(page, selector);
  }

  async close(): Promise<void> {
    await this.root.locator('[data-testid="modal-close"]').click();
    await this.waitForHidden();
  }

  async confirm(): Promise<void> {
    await this.root.locator('[data-testid="modal-confirm"]').click();
  }

  async getTitle(): Promise<string> {
    return this.root.locator('[data-testid="modal-title"]').innerText();
  }
}
