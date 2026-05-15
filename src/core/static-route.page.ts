import { BasePage } from './base.page';
import { step } from './step';

/**
 * 🐸 STATIC ROUTE PAGE
 *
 * Use this for pages that have a fixed, parameter-less URL (e.g., /login, /dashboard).
 * It provides a convenient `navigate()` method out of the box.
 *
 * For dynamic URLs (e.g., /user/123), extend `BasePage` instead.
 */
export abstract class StaticRoutePage extends BasePage {
  /**
   * The relative URL of the page (e.g., '/login').
   * It will be resolved against `baseURL` from the config.
   */
  abstract readonly url: string;

  /**
   * Navigates to the page and waits for the DOM to load.
   */
  async navigate(): Promise<void> {
    await step(`Navigate to page: ${this.url}`, async () => {
      await this.page.goto(this.url);
      await this.waitForPageLoad();
    });
  }
}
