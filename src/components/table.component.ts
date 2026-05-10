import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';

export class TableComponent extends BaseComponent {
  constructor(page: Page, containerSelector: string = '[data-testid="data-table"]') {
    super(page, containerSelector);
  }

  get rows(): Locator {
    // Поддержка как стандартных tr, так и кастомных карточек OrangeHRM
    return this.root.locator('tbody tr, .oxd-table-body .oxd-table-card');
  }

  async getRowCount(): Promise<number> {
    return this.rows.count();
  }

  async getRowByText(text: string): Promise<Locator> {
    return this.rows.filter({ hasText: text });
  }

  async getCellValue(row: number, column: number): Promise<string> {
    return this.rows.nth(row).locator('td').nth(column).innerText();
  }

  async sortByColumn(columnName: string): Promise<void> {
    await this.root.locator(`th`, { hasText: columnName }).click();
  }

  async waitForData(): Promise<void> {
    await this.rows.first().waitFor({ state: 'visible' });
  }
}
