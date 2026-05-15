import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/core/base.page';
import { step } from '@/core/step';

/**
 * Example of a dynamic Page Object whose URL contains a runtime parameter.
 * Extends BasePage directly (not StaticRoutePage) and implements navigate() with the ID baked in.
 *
 * Access via the getItemDetail(id) fixture factory rather than instantiating directly.
 */
export class ExampleDetailPage extends BasePage {
  private readonly heading: Locator;

  // Initialized in constructor body because heading is assigned there first
  readonly expect: ExampleDetailPageExpectations;

  constructor(
    page: Page,
    private readonly itemId: number
  ) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.expect = new ExampleDetailPageExpectations({ heading: this.heading });
  }

  get url(): string {
    return `/items/${this.itemId}`;
  }

  async navigate(): Promise<void> {
    await step(`Navigate to item detail #${this.itemId}`, async () => {
      await this.page.goto(this.url);
      await this.waitForPageLoad();
    });
  }
}

/**
 * All expect() calls for ExampleDetailPage live here.
 * Tests access assertions via: detailPage.expect.toHaveTitle('My Item')
 */
class ExampleDetailPageExpectations {
  constructor(private readonly locators: { heading: Locator }) {}

  async toHaveTitle(expected: string): Promise<void> {
    await step(`Verify item detail title: "${expected}"`, async () => {
      await expect(this.locators.heading).toHaveText(expected);
    });
  }
}
