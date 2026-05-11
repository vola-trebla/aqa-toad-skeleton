import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { Routes } from '@/constants/routes';
import { DashboardLabels } from '@/constants/dashboard';
import { step } from '@/core/step';

export class DashboardPage extends BasePage {
  private readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: DashboardLabels.heading });
  }

  async assertOpen(): Promise<void> {
    await step('Проверка что Dashboard открыт', async () => {
      await this.page.waitForURL((url) => url.pathname === Routes.dashboard.index);
      await expect(this.heading).toBeVisible();
    });
  }
}
