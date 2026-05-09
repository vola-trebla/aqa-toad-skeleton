import { Page, Locator } from '@playwright/test';
import { config } from '../config/env.config';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async navigate(): Promise<void> {
    await this.page.goto(`${config.BASE_URL}${this.url}`);
    await this.waitForPageLoad();
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  protected async clickAndWait(
    locator: Locator,
    options?: { waitForNavigation?: boolean; waitForResponse?: string }
  ): Promise<void> {
    if (options?.waitForResponse) {
      await Promise.all([
        this.page.waitForResponse(
          (resp) => resp.url().includes(options.waitForResponse!) && resp.ok()
        ),
        locator.click(),
      ]);
    } else if (options?.waitForNavigation) {
      await Promise.all([this.page.waitForNavigation(), locator.click()]);
    } else {
      await locator.click();
    }
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      fullPage: true,
      path: `screenshots/${name}-${Date.now()}.png`,
    });
  }
}
