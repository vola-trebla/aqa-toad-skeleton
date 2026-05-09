import { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly root: Locator;

  constructor(
    protected readonly page: Page,
    selector: string
  ) {
    this.root = page.locator(selector);
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  async waitForHidden(): Promise<void> {
    await this.root.waitFor({ state: 'hidden' });
  }
}
