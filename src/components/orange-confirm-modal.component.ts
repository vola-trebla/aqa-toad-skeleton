import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@/core/base.component';

/**
 * OrangeHRM-specific confirmation modal (uses role="dialog" + .oxd-button styles).
 */
export class OrangeConfirmModal extends BaseComponent {
  private readonly title: Locator;
  private readonly confirmBtn: Locator;
  private readonly cancelBtn: Locator;

  constructor(page: Page, selector: string = '[role="dialog"]') {
    super(page, selector);
    this.title = this.root.locator('.oxd-dialog-title');
    this.confirmBtn = this.root.locator('button.oxd-button--label-danger');
    this.cancelBtn = this.root.locator('button.oxd-button--text');
  }

  async confirm(): Promise<void> {
    await this.confirmBtn.click();
    await this.waitForHidden();
  }

  async cancel(): Promise<void> {
    await this.cancelBtn.click();
    await this.waitForHidden();
  }

  async getTitle(): Promise<string> {
    return this.title.innerText();
  }
}
