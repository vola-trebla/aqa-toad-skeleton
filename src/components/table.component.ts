import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../core/base.component';
import { UIElement } from '../core/ui-element';
import { step } from '../core/step';

export class TableComponent extends BaseComponent {
  readonly rows: UIElement;
  readonly firstRow: UIElement;

  constructor(page: Page, containerSelector: string = '.oxd-table') {
    super(page, containerSelector);

    // Поддержка OrangeHRM (.oxd-table-card) и классики (tr)
    const rowSelector = 'tbody tr, .oxd-table-body .oxd-table-card';
    this.rows = this.element(rowSelector, 'Table Rows');
    this.firstRow = this.element(`${rowSelector}:first-child`, 'First Table Row');
  }

  async shouldNotBeEmpty() {
    await this.firstRow.shouldBeVisible();
  }

  async getRowCount(): Promise<number> {
    return await step('Получение количества строк в таблице', () => this.rows.locator.count());
  }

  async getRowByText(text: string): Promise<Locator> {
    return this.rows.locator.filter({ hasText: text });
  }

  async getCellValue(row: number, column: number): Promise<string> {
    // Для OrangeHRM ячейки — это .oxd-table-cell
    return this.rows.locator.nth(row).locator('.oxd-table-cell, td').nth(column).innerText();
  }

  async sortByColumn(columnName: string): Promise<void> {
    const columnHeader = this.element(
      `.oxd-table-header [role="columnheader"]:has-text("${columnName}")`,
      `Column Header: ${columnName}`
    );
    await columnHeader.click();
  }

  async waitForData(): Promise<void> {
    await this.firstRow.shouldBeVisible();
  }
}
