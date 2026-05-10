import { Page } from '@playwright/test';
import { config } from '@/config/env.config';
import { UIElement } from './ui-element';
import { step } from './step';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  protected element(selector: string, name: string): UIElement {
    return new UIElement(this.page.locator(selector), name);
  }

  async navigate(): Promise<void> {
    await step(`Переход на страницу: ${this.url}`, async () => {
      await this.page.goto(`${config.BASE_URL}${this.url}`);
      await this.waitForPageLoad();
    });
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
