import { Locator, Page } from '@playwright/test';

/**
 * 🐸 BASE COMPONENT
 *
 * Use this for reusable UI widgets like Tables, Modals, or Navbars.
 * It encapsulates a root locator so the component is self-contained.
 */
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

  /**
   * Waits until the component is fully visible on the screen.
   */
  async waitForVisible(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  /**
   * Waits until the component vanishes into thin air.
   */
  async waitForHidden(): Promise<void> {
    await this.root.waitFor({ state: 'hidden' });
  }
}
