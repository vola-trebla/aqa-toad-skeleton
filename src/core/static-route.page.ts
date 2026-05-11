import { BasePage } from './base.page';
import { config } from '@/config/env.config';
import { step } from './step';

/**
 * Page Object with a fixed URL. Provides navigate() for opening the page.
 * Pages that require parameters (e.g. EmployeeDetailPage) should extend BasePage directly
 * and expose explicit open*() methods.
 */
export abstract class StaticRoutePage extends BasePage {
  abstract readonly url: string;

  async navigate(): Promise<void> {
    await step(`Переход на страницу: ${this.url}`, async () => {
      await this.page.goto(`${config.BASE_URL}${this.url}`);
      await this.waitForPageLoad();
    });
  }
}
