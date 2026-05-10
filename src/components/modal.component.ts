import { Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';
import { UIElement } from '../core/ui-element';

export class ModalComponent extends BaseComponent {
  readonly title: UIElement;
  readonly confirmBtn: UIElement;
  readonly cancelBtn: UIElement;

  // OrangeHRM uses role="dialog" for all modal dialogs
  constructor(page: Page, selector: string = '[role="dialog"]') {
    super(page, selector);

    this.title = this.element('.oxd-dialog-title', 'Modal Title');
    this.confirmBtn = this.element('button.oxd-button--label-danger', 'Confirm Button');
    this.cancelBtn = this.element('button.oxd-button--text', 'Cancel Button');
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
    return this.title.locator.innerText();
  }
}
