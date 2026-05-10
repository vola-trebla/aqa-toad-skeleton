import { Locator, Page, expect, test } from '@playwright/test';
import { BaseComponent } from '../core/base.component';

export class TableComponent extends BaseComponent {
  constructor(page: Page, containerSelector: string = '[data-testid="data-table"]') {
    super(page, containerSelector);
  }

  get rows(): Locator {
    // Поддержка как стандартных tr, так и кастомных карточек OrangeHRM
    return this.root.locator('tbody tr, .oxd-table-body .oxd-table-card');
  }

  async shouldNotBeEmpty() {
    await test.step('Проверка, что таблица не пустая', async () => {
      await expect(
        this.rows.first(),
        'Таблица не должна быть пустой (хотя бы одна строка)'
      ).toBeVisible();
    });
  }

  async getRowCount(): Promise<number> {
    return await test.step('Получение количества строк в таблице', async () => {
      return this.rows.count();
    });
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
